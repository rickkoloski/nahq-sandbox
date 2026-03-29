package com.nahq.accelerate.dto;

import java.math.BigDecimal;
import java.util.List;

public record GapAnalysisDto(
    Long userId,
    String userName,
    String roleName,
    String frameworkVersion,
    List<CompetencyGap> gaps,
    BigDecimal overallScore,
    BigDecimal overallTarget,
    BigDecimal overallGap
) {
    public record CompetencyGap(
        Long competencyId,
        String competencyName,
        String domainName,
        BigDecimal score,
        BigDecimal target,
        BigDecimal gap,
        String targetLevel,
        int rank
    ) {}
}
