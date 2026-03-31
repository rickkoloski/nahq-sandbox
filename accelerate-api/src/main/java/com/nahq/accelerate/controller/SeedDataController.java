package com.nahq.accelerate.controller;

import com.nahq.accelerate.service.SyntheticDataService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityManager;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/seed")
@Tag(name = "Seed Data", description = "Generate synthetic assessment data for demonstration")
public class SeedDataController {

    private final SyntheticDataService syntheticDataService;
    private final EntityManager em;

    public SeedDataController(SyntheticDataService syntheticDataService, EntityManager em) {
        this.syntheticDataService = syntheticDataService;
        this.em = em;
    }

    @PostMapping("/generate")
    @Operation(summary = "Generate synthetic users, assessments, and results",
               description = "Creates organizations, users with role assignments, and scored assessments " +
                             "with realistic score distributions across 29 competencies. Deterministic (seeded RNG).")
    public Map<String, Object> generate(@RequestParam(defaultValue = "100") int userCount) {
        return syntheticDataService.generateSyntheticData(userCount);
    }

    @PostMapping("/fix-demo-roles")
    @Operation(summary = "Fix demo account roles",
               description = "Ensures michael.reeves@tgh.org has the 'executive' role_type. " +
                             "Idempotent — safe to call multiple times.")
    @Transactional
    public Map<String, Object> fixDemoRoles() {
        // Get the executive role_type id
        Object executiveRoleId = em.createNativeQuery(
            "SELECT id FROM role_type WHERE internal_id = 'executive'"
        ).getSingleResult();

        // Get Michael's party_id via app_user
        @SuppressWarnings("unchecked")
        List<Object> michaelPartyIds = em.createNativeQuery(
            "SELECT party_id FROM app_user WHERE email = 'michael.reeves@tgh.org'"
        ).getResultList();

        if (michaelPartyIds.isEmpty()) {
            return Map.of("status", "skipped", "reason", "michael.reeves@tgh.org not found");
        }

        Object michaelPartyId = michaelPartyIds.get(0);

        // Update his party_role to executive
        int updated = em.createNativeQuery(
            "UPDATE party_role SET role_type_id = :roleId " +
            "WHERE party_id = :partyId AND thru_date IS NULL"
        ).setParameter("roleId", executiveRoleId)
         .setParameter("partyId", michaelPartyId)
         .executeUpdate();

        return Map.of(
            "status", "fixed",
            "email", "michael.reeves@tgh.org",
            "newRole", "executive",
            "rowsUpdated", updated
        );
    }

    @PostMapping("/redistribute-sites")
    @Operation(summary = "Redistribute individuals across subsidiary sites",
               description = "Finds the first health system org (one that has subsidiaries) " +
                             "and distributes its direct employees evenly (round-robin) across its subsidiary sites. " +
                             "Updates both party_relationship.to_party_id and party_role.organization_id. " +
                             "Refreshes materialized views after redistribution.")
    @Transactional
    public Map<String, Object> redistributeSites() {
        long start = System.currentTimeMillis();

        // 1. Find the first parent org that has subsidiaries (dynamic, not hardcoded)
        @SuppressWarnings("unchecked")
        List<Object[]> parentOrgs = em.createNativeQuery(
            "SELECT DISTINCT o.id, o.party_id FROM organization o " +
            "JOIN party p ON o.party_id = p.id " +
            "JOIN party_relationship pr ON pr.to_party_id = p.id " +
            "JOIN party_relationship_type prt ON pr.relationship_type_id = prt.id " +
            "WHERE prt.internal_id = 'subsidiary_of' AND pr.thru_date IS NULL " +
            "ORDER BY o.id LIMIT 1"
        ).getResultList();

        if (parentOrgs.isEmpty()) {
            return Map.of("error", "No parent org with subsidiaries found");
        }

        Long parentOrgId = ((Number) parentOrgs.get(0)[0]).longValue();
        Object parentPartyId = parentOrgs.get(0)[1];

        // 2. Get the 3 subsidiary party_ids
        @SuppressWarnings("unchecked")
        List<Object> subsidiaryPartyIds = em.createNativeQuery(
            "SELECT p2.id FROM party_relationship pr " +
            "JOIN party_relationship_type prt ON pr.relationship_type_id = prt.id " +
            "JOIN party p1 ON pr.to_party_id = p1.id " +
            "JOIN organization o ON o.party_id = p1.id " +
            "JOIN party p2 ON pr.from_party_id = p2.id " +
            "WHERE o.id = :parentOrgId AND prt.internal_id = 'subsidiary_of' AND pr.thru_date IS NULL " +
            "ORDER BY p2.id"
        ).setParameter("parentOrgId", parentOrgId).getResultList();

        if (subsidiaryPartyIds.isEmpty()) {
            return Map.of("error", "No subsidiary sites found for org " + parentOrgId);
        }

        // Build a map of subsidiary party_id → org_id for party_role updates
        Map<Long, Long> partyIdToOrgId = new LinkedHashMap<>();
        for (Object subPartyId : subsidiaryPartyIds) {
            Long spId = ((Number) subPartyId).longValue();
            Object orgId = em.createNativeQuery(
                "SELECT id FROM organization WHERE party_id = :partyId"
            ).setParameter("partyId", spId).getSingleResult();
            partyIdToOrgId.put(spId, ((Number) orgId).longValue());
        }

        // 3. Get all individuals employed by the parent
        @SuppressWarnings("unchecked")
        List<Object[]> employedRelationships = em.createNativeQuery(
            "SELECT pr.id, pr.from_party_id FROM party_relationship pr " +
            "JOIN party_relationship_type prt ON pr.relationship_type_id = prt.id " +
            "WHERE pr.to_party_id = :parentPartyId " +
            "AND prt.internal_id = 'employed_by' AND pr.thru_date IS NULL"
        ).setParameter("parentPartyId", parentPartyId).getResultList();

        // 4. Distribute round-robin across subsidiary party_ids
        List<Long> subIds = subsidiaryPartyIds.stream()
            .map(id -> ((Number) id).longValue()).toList();

        Map<Long, Integer> countsPerSite = new LinkedHashMap<>();
        for (Long spId : subIds) {
            countsPerSite.put(spId, 0);
        }

        for (int i = 0; i < employedRelationships.size(); i++) {
            Object[] row = employedRelationships.get(i);
            Long relId = ((Number) row[0]).longValue();
            Long fromPartyId = ((Number) row[1]).longValue();
            Long targetPartyId = subIds.get(i % subIds.size());

            // Update party_relationship to_party_id
            em.createNativeQuery(
                "UPDATE party_relationship SET to_party_id = :toPartyId WHERE id = :relId"
            ).setParameter("toPartyId", targetPartyId)
             .setParameter("relId", relId)
             .executeUpdate();

            // 5. Update party_role.organization_id for this person
            Long targetOrgId = partyIdToOrgId.get(targetPartyId);
            em.createNativeQuery(
                "UPDATE party_role SET organization_id = :orgId " +
                "WHERE party_id = :partyId AND thru_date IS NULL"
            ).setParameter("orgId", targetOrgId)
             .setParameter("partyId", fromPartyId)
             .executeUpdate();

            countsPerSite.merge(targetPartyId, 1, Integer::sum);
        }

        // 6. Refresh materialized views
        em.createNativeQuery("REFRESH MATERIALIZED VIEW CONCURRENTLY mv_competency_benchmarks").executeUpdate();
        em.createNativeQuery("REFRESH MATERIALIZED VIEW CONCURRENTLY mv_org_capability_summary").executeUpdate();
        em.createNativeQuery("REFRESH MATERIALIZED VIEW CONCURRENTLY mv_domain_benchmarks").executeUpdate();
        em.createNativeQuery("REFRESH MATERIALIZED VIEW CONCURRENTLY mv_org_domain_summary").executeUpdate();

        long elapsed = System.currentTimeMillis() - start;

        // 7. Build summary with site names
        List<Map<String, Object>> siteSummaries = new ArrayList<>();
        for (Long spId : subIds) {
            @SuppressWarnings("unchecked")
            List<Object> names = em.createNativeQuery(
                "SELECT name FROM organization WHERE party_id = :partyId"
            ).setParameter("partyId", spId).getResultList();
            String siteName = names.isEmpty() ? "Unknown" : (String) names.get(0);

            Map<String, Object> site = new LinkedHashMap<>();
            site.put("partyId", spId);
            site.put("siteName", siteName);
            site.put("count", countsPerSite.get(spId));
            siteSummaries.add(site);
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalRedistributed", employedRelationships.size());
        result.put("sites", siteSummaries);
        result.put("elapsedMs", elapsed);
        return result;
    }
}
