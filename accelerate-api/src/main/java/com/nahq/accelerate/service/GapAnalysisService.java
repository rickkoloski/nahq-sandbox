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

@Service
public class GapAnalysisService {

    private final AppUserRepository userRepo;
    private final UserRoleRepository userRoleRepo;
    private final AssessmentResultRepository resultRepo;
    private final RoleTargetRepository targetRepo;

    public GapAnalysisService(AppUserRepository userRepo, UserRoleRepository userRoleRepo,
                              AssessmentResultRepository resultRepo, RoleTargetRepository targetRepo) {
        this.userRepo = userRepo;
        this.userRoleRepo = userRoleRepo;
        this.resultRepo = resultRepo;
        this.targetRepo = targetRepo;
    }

    @Transactional(readOnly = true)
    public GapAnalysisDto analyzeGaps(Long userId) {
        AppUser user = userRepo.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        // Find user's active role
        List<UserRole> activeRoles = userRoleRepo.findByUserIdAndThruDateIsNull(userId);
        if (activeRoles.isEmpty()) {
            throw new RuntimeException("User has no active role: " + userId);
        }

        // Use the first active role (typically participant)
        UserRole activeRole = activeRoles.get(0);
        RoleType roleType = activeRole.getRoleType();

        // Get role targets for the published framework version
        List<RoleTarget> targets = targetRepo
            .findByRoleTypeInternalIdAndFrameworkVersionVersionLabel(roleType.getInternalId(), "2025-v1");

        Map<Long, RoleTarget> targetByCompetency = targets.stream()
            .collect(Collectors.toMap(t -> t.getCompetency().getId(), t -> t));

        // Get user's most recent assessment results
        List<AssessmentResult> results = resultRepo.findByAssessmentUserId(userId);

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
                    0 // rank assigned after sorting
                );
            })
            .sorted(Comparator.comparing(CompetencyGap::gap)) // largest negative gaps first
            .map(g -> new CompetencyGap(
                g.competencyId(), g.competencyName(), g.domainName(),
                g.score(), g.target(), g.gap(), g.targetLevel(),
                rank.incrementAndGet()
            ))
            .toList();

        // Overall averages
        BigDecimal avgScore = gaps.stream().map(CompetencyGap::score)
            .reduce(BigDecimal.ZERO, BigDecimal::add)
            .divide(BigDecimal.valueOf(Math.max(1, gaps.size())), 2, RoundingMode.HALF_UP);
        BigDecimal avgTarget = gaps.stream().map(CompetencyGap::target)
            .reduce(BigDecimal.ZERO, BigDecimal::add)
            .divide(BigDecimal.valueOf(Math.max(1, gaps.size())), 2, RoundingMode.HALF_UP);

        return new GapAnalysisDto(
            user.getId(),
            user.getFullName(),
            roleType.getName(),
            "2025-v1",
            gaps,
            avgScore,
            avgTarget,
            avgScore.subtract(avgTarget)
        );
    }
}
