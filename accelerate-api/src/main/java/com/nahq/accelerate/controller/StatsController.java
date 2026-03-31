package com.nahq.accelerate.controller;

import com.nahq.accelerate.dto.OrgStatsDto;
import com.nahq.accelerate.dto.PlatformStatsDto;
import com.nahq.accelerate.service.OrganizationHierarchyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityManager;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.*;

@RestController
@Tag(name = "Statistics", description = "Platform and organization statistics for dashboards")
public class StatsController {

    private final EntityManager em;
    private final OrganizationHierarchyService hierarchyService;

    public StatsController(EntityManager em, OrganizationHierarchyService hierarchyService) {
        this.em = em;
        this.hierarchyService = hierarchyService;
    }

    @GetMapping("/api/stats/platform")
    @Operation(summary = "Platform-wide statistics for admin dashboard")
    public PlatformStatsDto platformStats() {
        int orgs = ((Number) em.createNativeQuery("SELECT COUNT(*) FROM organization").getSingleResult()).intValue();
        int users = ((Number) em.createNativeQuery("SELECT COUNT(*) FROM individual").getSingleResult()).intValue();
        int courses = ((Number) em.createNativeQuery("SELECT COUNT(*) FROM lms_course").getSingleResult()).intValue();
        int domains = ((Number) em.createNativeQuery("SELECT COUNT(*) FROM competency_domain").getSingleResult()).intValue();
        int competencies = ((Number) em.createNativeQuery("SELECT COUNT(*) FROM competency").getSingleResult()).intValue();
        return new PlatformStatsDto(orgs, users, courses, domains, competencies);
    }

    @GetMapping("/api/organizations/{orgId}/sites")
    @Operation(summary = "List subsidiary sites for an organization",
               description = "Uses OrganizationHierarchyService to find subsidiaries via Party relationships.")
    public List<Map<String, Object>> orgSites(@PathVariable Long orgId) {
        return hierarchyService.getSubsidiaries(orgId).stream().map(sub -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", sub.id());
            m.put("name", sub.name());
            m.put("orgType", sub.orgType());
            m.put("city", null);  // site table lookup deferred — not critical for dashboard
            m.put("state", null);
            return m;
        }).toList();
    }

    @GetMapping("/api/organizations/{orgId}/stats")
    @Operation(summary = "Organization assessment statistics via Party model",
               description = "Counts individuals employed across the org's full scope (self + subsidiaries), " +
                             "their assessment completion, and last assessment date. " +
                             "Uses org_with_subsidiaries() for transparent hierarchy aggregation.")
    public OrgStatsDto orgStats(@PathVariable Long orgId) {
        // All queries use the same scope: this org + subsidiaries
        // The DB function handles the hierarchy traversal.
        String scopeClause = "o.id IN (SELECT * FROM org_with_subsidiaries(:orgId))";

        int totalUsers = ((Number) em.createNativeQuery(
            "SELECT COUNT(DISTINCT pr.from_party_id) " +
            "FROM party_relationship pr " +
            "JOIN party_relationship_type prt ON pr.relationship_type_id = prt.id " +
            "JOIN organization o ON o.party_id = pr.to_party_id " +
            "WHERE " + scopeClause + " AND prt.internal_id = 'employed_by' AND pr.thru_date IS NULL"
        ).setParameter("orgId", orgId).getSingleResult()).intValue();

        int completed = ((Number) em.createNativeQuery(
            "SELECT COUNT(DISTINCT a.id) " +
            "FROM assessment a " +
            "JOIN party_relationship pr ON a.party_id = pr.from_party_id AND pr.thru_date IS NULL " +
            "JOIN party_relationship_type prt ON pr.relationship_type_id = prt.id AND prt.internal_id = 'employed_by' " +
            "JOIN organization o ON o.party_id = pr.to_party_id " +
            "WHERE " + scopeClause + " AND a.status = 'SCORED'"
        ).setParameter("orgId", orgId).getSingleResult()).intValue();

        int notStarted = totalUsers - completed;
        int pct = totalUsers > 0 ? Math.round((float) completed / totalUsers * 100) : 0;

        @SuppressWarnings("unchecked")
        List<Object> dates = em.createNativeQuery(
            "SELECT MAX(a.scored_at) " +
            "FROM assessment a " +
            "JOIN party_relationship pr ON a.party_id = pr.from_party_id AND pr.thru_date IS NULL " +
            "JOIN party_relationship_type prt ON pr.relationship_type_id = prt.id AND prt.internal_id = 'employed_by' " +
            "JOIN organization o ON o.party_id = pr.to_party_id " +
            "WHERE " + scopeClause + " AND a.status = 'SCORED'"
        ).setParameter("orgId", orgId).getResultList();

        Instant lastDate = null;
        if (!dates.isEmpty() && dates.get(0) != null) {
            lastDate = ((Timestamp) dates.get(0)).toInstant();
        }

        return new OrgStatsDto(totalUsers, completed, notStarted, pct, lastDate);
    }
}
