package com.nahq.accelerate.controller;

import com.nahq.accelerate.dto.OrgStatsDto;
import com.nahq.accelerate.dto.PlatformStatsDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityManager;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;

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
        int users = ((Number) em.createNativeQuery("SELECT COUNT(*) FROM app_user").getSingleResult()).intValue();
        int courses = ((Number) em.createNativeQuery("SELECT COUNT(*) FROM lms_course").getSingleResult()).intValue();
        int domains = ((Number) em.createNativeQuery("SELECT COUNT(*) FROM competency_domain").getSingleResult()).intValue();
        int competencies = ((Number) em.createNativeQuery("SELECT COUNT(*) FROM competency").getSingleResult()).intValue();
        return new PlatformStatsDto(orgs, users, courses, domains, competencies);
    }

    @GetMapping("/api/organizations/{orgId}/stats")
    @Operation(summary = "Organization assessment statistics",
               description = "Completion counts, rates, and last assessment date — all from live data")
    public OrgStatsDto orgStats(@PathVariable Long orgId) {
        int totalUsers = ((Number) em.createNativeQuery(
            "SELECT COUNT(*) FROM app_user WHERE organization_id = :orgId"
        ).setParameter("orgId", orgId).getSingleResult()).intValue();

        int completed = ((Number) em.createNativeQuery(
            "SELECT COUNT(*) FROM assessment a JOIN app_user u ON a.user_id = u.id " +
            "WHERE u.organization_id = :orgId AND a.status = 'SCORED'"
        ).setParameter("orgId", orgId).getSingleResult()).intValue();

        int notStarted = totalUsers - completed;
        int pct = totalUsers > 0 ? Math.round((float) completed / totalUsers * 100) : 0;

        @SuppressWarnings("unchecked")
        List<Object> dates = em.createNativeQuery(
            "SELECT MAX(a.scored_at) FROM assessment a JOIN app_user u ON a.user_id = u.id " +
            "WHERE u.organization_id = :orgId AND a.status = 'SCORED'"
        ).setParameter("orgId", orgId).getResultList();

        Instant lastDate = null;
        if (!dates.isEmpty() && dates.get(0) != null) {
            lastDate = ((Timestamp) dates.get(0)).toInstant();
        }

        return new OrgStatsDto(totalUsers, completed, notStarted, pct, lastDate);
    }
}
