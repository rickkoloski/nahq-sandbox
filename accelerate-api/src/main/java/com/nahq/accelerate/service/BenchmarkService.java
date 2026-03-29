package com.nahq.accelerate.service;

import com.nahq.accelerate.domain.*;
import com.nahq.accelerate.dto.BenchmarkComparisonDto;
import com.nahq.accelerate.dto.BenchmarkComparisonDto.CompetencyBenchmark;
import com.nahq.accelerate.dto.OrgCapabilitySummaryDto;
import com.nahq.accelerate.dto.OrgCapabilitySummaryDto.DomainSummary;
import com.nahq.accelerate.repository.*;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

/**
 * Benchmark service. Resolves User → Party for individual lookups.
 * Org-level queries go directly through materialized views.
 */
@Service
public class BenchmarkService {

    private final EntityManager em;
    private final AppUserRepository userRepo;
    private final PartyRoleRepository partyRoleRepo;
    private final AssessmentResultRepository resultRepo;

    public BenchmarkService(EntityManager em, AppUserRepository userRepo,
                            PartyRoleRepository partyRoleRepo, AssessmentResultRepository resultRepo) {
        this.em = em;
        this.userRepo = userRepo;
        this.partyRoleRepo = partyRoleRepo;
        this.resultRepo = resultRepo;
    }

    @Transactional(readOnly = true)
    public BenchmarkComparisonDto getUserBenchmarks(Long userId) {
        long start = System.currentTimeMillis();

        // Resolve User → Party
        AppUser user = userRepo.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        Party party = user.getParty();

        List<PartyRole> roles = partyRoleRepo.findByPartyIdAndThruDateIsNull(party.getId());
        String roleName = roles.isEmpty() ? "Unknown" : roles.get(0).getRoleType().getName();

        // Get scores via Party
        List<AssessmentResult> results = resultRepo.findByAssessmentPartyId(party.getId());
        Map<Long, BigDecimal> scoreByCompetency = new LinkedHashMap<>();
        for (AssessmentResult r : results) {
            scoreByCompetency.merge(r.getCompetency().getId(), r.getScore(),
                (existing, incoming) -> incoming);
        }

        // National benchmarks from materialized view
        @SuppressWarnings("unchecked")
        List<Object[]> benchmarks = em.createNativeQuery(
            "SELECT competency_id, competency_name, domain_name, " +
            "mean_score, p25, p50, p75, p90, sample_size " +
            "FROM mv_competency_benchmarks ORDER BY competency_id"
        ).getResultList();

        List<CompetencyBenchmark> comparisons = new ArrayList<>();
        for (Object[] row : benchmarks) {
            Long compId = ((Number) row[0]).longValue();
            BigDecimal userScore = scoreByCompetency.getOrDefault(compId, BigDecimal.ZERO);
            BigDecimal p25 = (BigDecimal) row[4];
            BigDecimal p50 = (BigDecimal) row[5];
            BigDecimal p75 = (BigDecimal) row[6];
            BigDecimal p90 = (BigDecimal) row[7];

            String percentileLabel;
            if (userScore.compareTo(p90) >= 0) percentileLabel = "Top 10%";
            else if (userScore.compareTo(p75) >= 0) percentileLabel = "Top 25%";
            else if (userScore.compareTo(p50) >= 0) percentileLabel = "Above Median";
            else if (userScore.compareTo(p25) >= 0) percentileLabel = "Below Median";
            else percentileLabel = "Bottom 25%";

            comparisons.add(new CompetencyBenchmark(
                compId, (String) row[1], (String) row[2],
                userScore, p25, p50, p75, p90, (BigDecimal) row[3],
                percentileLabel, ((Number) row[8]).intValue()
            ));
        }

        long elapsed = System.currentTimeMillis() - start;
        return new BenchmarkComparisonDto(userId, party.getDisplayName(), roleName, comparisons, elapsed);
    }

    @Transactional(readOnly = true)
    public OrgCapabilitySummaryDto getOrgCapability(Long orgId) {
        long start = System.currentTimeMillis();

        @SuppressWarnings("unchecked")
        List<Object[]> orgDomains = em.createNativeQuery(
            "SELECT o.domain_id, o.domain_name, o.org_avg_score, o.participant_count, o.organization_name, " +
            "d.mean_score AS national_mean, d.p50 AS national_p50 " +
            "FROM mv_org_domain_summary o " +
            "JOIN mv_domain_benchmarks d ON o.domain_id = d.domain_id " +
            "WHERE o.organization_id = :orgId " +
            "ORDER BY o.display_order"
        ).setParameter("orgId", orgId).getResultList();

        if (orgDomains.isEmpty()) {
            throw new RuntimeException("Organization not found or has no assessment data: " + orgId);
        }

        String orgName = (String) orgDomains.get(0)[4];
        List<DomainSummary> domains = new ArrayList<>();
        BigDecimal totalOrgScore = BigDecimal.ZERO;
        BigDecimal totalNationalScore = BigDecimal.ZERO;
        int maxParticipants = 0;

        for (Object[] row : orgDomains) {
            BigDecimal orgAvg = (BigDecimal) row[2];
            BigDecimal nationalMean = (BigDecimal) row[5];
            BigDecimal nationalP50 = (BigDecimal) row[6];
            int participants = ((Number) row[3]).intValue();

            BigDecimal diff = orgAvg.subtract(nationalMean);
            String vsNational;
            if (diff.abs().compareTo(new BigDecimal("0.15")) <= 0) vsNational = "At National Average";
            else if (diff.compareTo(BigDecimal.ZERO) > 0) vsNational = "Above National Average (+" + diff.setScale(2, RoundingMode.HALF_UP) + ")";
            else vsNational = "Below National Average (" + diff.setScale(2, RoundingMode.HALF_UP) + ")";

            domains.add(new DomainSummary(
                ((Number) row[0]).longValue(), (String) row[1],
                orgAvg, nationalP50, nationalMean, participants, vsNational
            ));

            totalOrgScore = totalOrgScore.add(orgAvg);
            totalNationalScore = totalNationalScore.add(nationalMean);
            maxParticipants = Math.max(maxParticipants, participants);
        }

        int domainCount = domains.size();
        BigDecimal overallOrg = totalOrgScore.divide(BigDecimal.valueOf(domainCount), 2, RoundingMode.HALF_UP);
        BigDecimal overallNational = totalNationalScore.divide(BigDecimal.valueOf(domainCount), 2, RoundingMode.HALF_UP);

        long elapsed = System.currentTimeMillis() - start;
        return new OrgCapabilitySummaryDto(orgId, orgName, domains, overallOrg, overallNational, maxParticipants, elapsed);
    }

    @Transactional
    public Map<String, Object> refreshViews() {
        long start = System.currentTimeMillis();
        em.createNativeQuery("REFRESH MATERIALIZED VIEW CONCURRENTLY mv_competency_benchmarks").executeUpdate();
        em.createNativeQuery("REFRESH MATERIALIZED VIEW CONCURRENTLY mv_org_capability_summary").executeUpdate();
        em.createNativeQuery("REFRESH MATERIALIZED VIEW CONCURRENTLY mv_domain_benchmarks").executeUpdate();
        em.createNativeQuery("REFRESH MATERIALIZED VIEW CONCURRENTLY mv_org_domain_summary").executeUpdate();
        long elapsed = System.currentTimeMillis() - start;
        return Map.of("refreshed", 4, "elapsedMs", elapsed);
    }
}
