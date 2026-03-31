package com.nahq.accelerate.controller;

import com.nahq.accelerate.service.OrganizationHierarchyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityManager;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

/**
 * Competency matrix — cross-site and cross-role competency comparisons.
 * Uses OrganizationHierarchyService for subsidiary resolution.
 */
@RestController
@Tag(name = "Competency Matrix", description = "Cross-site and cross-role competency comparisons by domain")
public class CompetencyMatrixController {

    private final EntityManager em;
    private final OrganizationHierarchyService hierarchyService;

    public CompetencyMatrixController(EntityManager em, OrganizationHierarchyService hierarchyService) {
        this.em = em;
        this.hierarchyService = hierarchyService;
    }

    @GetMapping("/api/organizations/{orgId}/competency-matrix")
    @Operation(summary = "Competency matrix grouped by site or role",
               description = "Returns average assessment scores per competency domain, grouped by subsidiary site " +
                             "or by role type. Uses the org hierarchy service for subsidiary resolution.")
    @Transactional(readOnly = true)
    public Map<String, Object> competencyMatrix(
            @PathVariable Long orgId,
            @RequestParam(defaultValue = "site") String groupBy) {

        long start = System.currentTimeMillis();

        List<Map<String, Object>> groups;
        if ("role".equals(groupBy)) {
            groups = buildRoleGroups(orgId);
        } else {
            groups = buildSiteGroups(orgId);
        }

        long elapsed = System.currentTimeMillis() - start;

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("organizationId", orgId);
        result.put("groupBy", groupBy);
        result.put("groups", groups);
        result.put("queryTimeMs", elapsed);
        return result;
    }

    private List<Map<String, Object>> buildSiteGroups(Long orgId) {
        List<OrganizationHierarchyService.SubsidiaryOrg> subsidiaries = hierarchyService.getSubsidiaries(orgId);

        List<Map<String, Object>> groups = new ArrayList<>();
        for (OrganizationHierarchyService.SubsidiaryOrg sub : subsidiaries) {
            @SuppressWarnings("unchecked")
            List<Object[]> domainRows = em.createNativeQuery(
                "SELECT cd.name as domain_name, AVG(ar.score) as avg_score, " +
                "COUNT(DISTINCT a.party_id) as participant_count " +
                "FROM assessment_result ar " +
                "JOIN assessment a ON ar.assessment_id = a.id " +
                "JOIN competency c ON ar.competency_id = c.id " +
                "JOIN competency_domain cd ON c.domain_id = cd.id " +
                "JOIN party_relationship pr ON a.party_id = pr.from_party_id " +
                "JOIN party_relationship_type prt ON pr.relationship_type_id = prt.id " +
                "JOIN organization o ON o.party_id = pr.to_party_id " +
                "WHERE o.id = :siteOrgId AND prt.internal_id = 'employed_by' " +
                "AND pr.thru_date IS NULL AND a.status = 'SCORED' " +
                "GROUP BY cd.id, cd.name " +
                "ORDER BY cd.display_order"
            ).setParameter("siteOrgId", sub.id()).getResultList();

            List<Map<String, Object>> domains = new ArrayList<>();
            int maxParticipants = 0;
            for (Object[] dr : domainRows) {
                Map<String, Object> domain = new LinkedHashMap<>();
                domain.put("domainName", (String) dr[0]);
                domain.put("avgScore", toBigDecimal(dr[1]));
                int pCount = ((Number) dr[2]).intValue();
                maxParticipants = Math.max(maxParticipants, pCount);
                domains.add(domain);
            }

            Map<String, Object> group = new LinkedHashMap<>();
            group.put("name", sub.name());
            group.put("id", sub.id());
            group.put("participantCount", maxParticipants);
            group.put("domains", domains);
            groups.add(group);
        }

        return groups;
    }

    private List<Map<String, Object>> buildRoleGroups(Long orgId) {
        // Uses org_with_subsidiaries() to include all orgs in scope
        @SuppressWarnings("unchecked")
        List<Object[]> rows = em.createNativeQuery(
            "SELECT rt.name as role_name, rt.id as role_id, cd.name as domain_name, " +
            "AVG(ar.score) as avg_score, COUNT(DISTINCT a.party_id) as participant_count " +
            "FROM assessment_result ar " +
            "JOIN assessment a ON ar.assessment_id = a.id " +
            "JOIN competency c ON ar.competency_id = c.id " +
            "JOIN competency_domain cd ON c.domain_id = cd.id " +
            "JOIN party_role prole ON a.party_id = prole.party_id AND prole.thru_date IS NULL " +
            "JOIN role_type rt ON prole.role_type_id = rt.id " +
            "JOIN party_relationship pr ON a.party_id = pr.from_party_id " +
            "JOIN party_relationship_type prt ON pr.relationship_type_id = prt.id " +
            "JOIN organization o ON o.party_id = pr.to_party_id " +
            "WHERE prt.internal_id = 'employed_by' AND pr.thru_date IS NULL AND a.status = 'SCORED' " +
            "AND o.id IN (SELECT * FROM org_with_subsidiaries(:orgId)) " +
            "GROUP BY rt.id, rt.name, cd.id, cd.name, cd.display_order " +
            "ORDER BY rt.name, cd.display_order"
        ).setParameter("orgId", orgId).getResultList();

        Map<Long, Map<String, Object>> roleGroups = new LinkedHashMap<>();
        for (Object[] row : rows) {
            String roleName = (String) row[0];
            Long roleId = ((Number) row[1]).longValue();

            Map<String, Object> group = roleGroups.computeIfAbsent(roleId, k -> {
                Map<String, Object> g = new LinkedHashMap<>();
                g.put("name", roleName);
                g.put("id", roleId);
                g.put("participantCount", 0);
                g.put("domains", new ArrayList<Map<String, Object>>());
                return g;
            });

            Map<String, Object> domain = new LinkedHashMap<>();
            domain.put("domainName", (String) row[2]);
            domain.put("avgScore", toBigDecimal(row[3]));

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> domains = (List<Map<String, Object>>) group.get("domains");
            domains.add(domain);

            int participantCount = ((Number) row[4]).intValue();
            int currentMax = ((Number) group.get("participantCount")).intValue();
            if (participantCount > currentMax) {
                group.put("participantCount", participantCount);
            }
        }

        return new ArrayList<>(roleGroups.values());
    }

    private static BigDecimal toBigDecimal(Object value) {
        if (value instanceof BigDecimal bd) return bd.setScale(2, RoundingMode.HALF_UP);
        return BigDecimal.valueOf(((Number) value).doubleValue()).setScale(2, RoundingMode.HALF_UP);
    }
}
