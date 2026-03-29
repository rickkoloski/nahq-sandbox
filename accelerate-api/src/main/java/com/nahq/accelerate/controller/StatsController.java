package com.nahq.accelerate.controller;

import com.nahq.accelerate.dto.OrgStatsDto;
import com.nahq.accelerate.dto.PlatformStatsDto;
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

    public StatsController(EntityManager em) {
        this.em = em;
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
    @Operation(summary = "List subsidiary sites for an organization via Party relationships")
    public List<Map<String, Object>> orgSites(@PathVariable Long orgId) {
        @SuppressWarnings("unchecked")
        List<Object[]> rows = em.createNativeQuery(
            "SELECT o2.id, o2.name, o2.org_type, s.city, s.state " +
            "FROM organization o1 " +
            "JOIN party p1 ON o1.party_id = p1.id " +
            "JOIN party_relationship pr ON pr.to_party_id = p1.id " +
            "JOIN party_relationship_type prt ON pr.relationship_type_id = prt.id AND prt.internal_id = 'subsidiary_of' " +
            "JOIN party p2 ON pr.from_party_id = p2.id " +
            "JOIN organization o2 ON o2.party_id = p2.id " +
            "LEFT JOIN site s ON s.organization_id = o1.id AND s.name = o2.name " +
            "WHERE o1.id = :orgId AND pr.thru_date IS NULL"
        ).setParameter("orgId", orgId).getResultList();

        return rows.stream().map(r -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", ((Number) r[0]).longValue());
            m.put("name", r[1]);
            m.put("orgType", r[2]);
            m.put("city", r[3]);
            m.put("state", r[4]);
            return m;
        }).toList();
    }

    @GetMapping("/api/organizations/{orgId}/stats")
    @Operation(summary = "Organization assessment statistics via Party model",
               description = "Counts individuals employed by this org (via PartyRelationship), " +
                             "their assessment completion, and last assessment date.")
    public OrgStatsDto orgStats(@PathVariable Long orgId) {
        // Count individuals employed by this org via PartyRelationship
        int totalUsers = ((Number) em.createNativeQuery(
            "SELECT COUNT(DISTINCT pr.from_party_id) " +
            "FROM party_relationship pr " +
            "JOIN party_relationship_type prt ON pr.relationship_type_id = prt.id " +
            "JOIN organization o ON o.party_id = pr.to_party_id " +
            "WHERE o.id = :orgId AND prt.internal_id = 'employed_by' AND pr.thru_date IS NULL"
        ).setParameter("orgId", orgId).getSingleResult()).intValue();

        // Count completed assessments for individuals in this org
        int completed = ((Number) em.createNativeQuery(
            "SELECT COUNT(DISTINCT a.id) " +
            "FROM assessment a " +
            "JOIN party_relationship pr ON a.party_id = pr.from_party_id AND pr.thru_date IS NULL " +
            "JOIN party_relationship_type prt ON pr.relationship_type_id = prt.id AND prt.internal_id = 'employed_by' " +
            "JOIN organization o ON o.party_id = pr.to_party_id " +
            "WHERE o.id = :orgId AND a.status = 'SCORED'"
        ).setParameter("orgId", orgId).getSingleResult()).intValue();

        int notStarted = totalUsers - completed;
        int pct = totalUsers > 0 ? Math.round((float) completed / totalUsers * 100) : 0;

        // Last assessment date
        @SuppressWarnings("unchecked")
        List<Object> dates = em.createNativeQuery(
            "SELECT MAX(a.scored_at) " +
            "FROM assessment a " +
            "JOIN party_relationship pr ON a.party_id = pr.from_party_id AND pr.thru_date IS NULL " +
            "JOIN party_relationship_type prt ON pr.relationship_type_id = prt.id AND prt.internal_id = 'employed_by' " +
            "JOIN organization o ON o.party_id = pr.to_party_id " +
            "WHERE o.id = :orgId AND a.status = 'SCORED'"
        ).setParameter("orgId", orgId).getResultList();

        Instant lastDate = null;
        if (!dates.isEmpty() && dates.get(0) != null) {
            lastDate = ((Timestamp) dates.get(0)).toInstant();
        }

        return new OrgStatsDto(totalUsers, completed, notStarted, pct, lastDate);
    }
}
