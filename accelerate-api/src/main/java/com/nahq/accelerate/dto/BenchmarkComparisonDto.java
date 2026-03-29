package com.nahq.accelerate.dto;

import java.math.BigDecimal;
import java.util.List;

public record BenchmarkComparisonDto(
    Long userId,
    String userName,
    String roleName,
    List<CompetencyBenchmark> competencies,
    long queryTimeMs
) {
    public record CompetencyBenchmark(
        Long competencyId,
        String competencyName,
        String domainName,
        BigDecimal userScore,
        BigDecimal nationalP25,
        BigDecimal nationalP50,
        BigDecimal nationalP75,
        BigDecimal nationalP90,
        BigDecimal nationalMean,
        String percentileLabel,
        int sampleSize
    ) {}
}
