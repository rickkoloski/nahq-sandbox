package com.nahq.accelerate.service;

import com.nahq.accelerate.domain.*;
import com.nahq.accelerate.dto.GapAnalysisDto;
import com.nahq.accelerate.dto.GapAnalysisDto.CompetencyGap;
import com.nahq.accelerate.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

/**
 * Gap analysis operates on Party, not User.
 * User is the auth entry point; Party is the domain identity.
 * userId → app_user.party_id → Party → PartyRole + AssessmentResults
 */
@Service
public class GapAnalysisService {

    private final AppUserRepository userRepo;
    private final PartyRoleRepository partyRoleRepo;
    private final AssessmentResultRepository resultRepo;
    private final RoleTargetRepository targetRepo;

    public GapAnalysisService(AppUserRepository userRepo, PartyRoleRepository partyRoleRepo,
                              AssessmentResultRepository resultRepo, RoleTargetRepository targetRepo) {
        this.userRepo = userRepo;
        this.partyRoleRepo = partyRoleRepo;
        this.resultRepo = resultRepo;
        this.targetRepo = targetRepo;
    }

    @Transactional(readOnly = true)
    public GapAnalysisDto analyzeGaps(Long userId) {
        // Resolve User → Party
        AppUser user = userRepo.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        Party party = user.getParty();
        if (party == null) {
            throw new RuntimeException("User has no Party identity: " + userId);
        }

        // Find Party's active roles (not User's roles — Party is the domain identity)
        List<PartyRole> activeRoles = partyRoleRepo.findByPartyIdAndThruDateIsNull(party.getId());
        if (activeRoles.isEmpty()) {
            throw new RuntimeException("Party has no active role: " + party.getDisplayName());
        }

        PartyRole activeRole = activeRoles.get(0);
        RoleType roleType = activeRole.getRoleType();

        // Get role targets for the published framework version
        List<RoleTarget> targets = targetRepo
            .findByRoleTypeInternalIdAndFrameworkVersionVersionLabel(roleType.getInternalId(), "2025-v1");

        Map<Long, RoleTarget> targetByCompetency = targets.stream()
            .collect(Collectors.toMap(t -> t.getCompetency().getId(), t -> t));

        // Get assessment results via Party (not via User)
        List<AssessmentResult> results = resultRepo.findByAssessmentPartyId(party.getId());

        // Deduplicate: keep latest result per competency
        Map<Long, AssessmentResult> latestByCompetency = new LinkedHashMap<>();
        for (AssessmentResult r : results) {
            latestByCompetency.merge(r.getCompetency().getId(), r,
                (existing, incoming) -> incoming.getId() > existing.getId() ? incoming : existing);
        }

        // Calculate gaps
        AtomicInteger rank = new AtomicInteger(0);
        List<CompetencyGap> gaps = latestByCompetency.values().stream()
            .map(result -> {
                RoleTarget target = targetByCompetency.get(result.getCompetency().getId());
                BigDecimal targetScore = target != null ? target.getTargetScore() : BigDecimal.ZERO;
                BigDecimal gap = result.getScore().subtract(targetScore);
                return new CompetencyGap(
                    result.getCompetency().getId(),
                    result.getCompetency().getName(),
                    result.getCompetency().getDomain().getName(),
                    result.getScore(),
                    targetScore,
                    gap,
                    target != null ? target.getTargetLevel() : "UNKNOWN",
                    0
                );
            })
            .sorted(Comparator.comparing(CompetencyGap::gap))
            .map(g -> new CompetencyGap(
                g.competencyId(), g.competencyName(), g.domainName(),
                g.score(), g.target(), g.gap(), g.targetLevel(),
                rank.incrementAndGet()
            ))
            .toList();

        BigDecimal avgScore = gaps.stream().map(CompetencyGap::score)
            .reduce(BigDecimal.ZERO, BigDecimal::add)
            .divide(BigDecimal.valueOf(Math.max(1, gaps.size())), 2, RoundingMode.HALF_UP);
        BigDecimal avgTarget = gaps.stream().map(CompetencyGap::target)
            .reduce(BigDecimal.ZERO, BigDecimal::add)
            .divide(BigDecimal.valueOf(Math.max(1, gaps.size())), 2, RoundingMode.HALF_UP);

        return new GapAnalysisDto(
            user.getId(),
            party.getDisplayName(),
            roleType.getName(),
            "2025-v1",
            gaps,
            avgScore,
            avgTarget,
            avgScore.subtract(avgTarget)
        );
    }
}
