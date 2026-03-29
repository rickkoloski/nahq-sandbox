package com.nahq.accelerate.dto;

import java.math.BigDecimal;
import java.util.List;

public record CourseSimilarityDto(
    Long competencyId,
    String competencyName,
    String domainName,
    List<SimilarCourse> courses,
    long queryTimeMs
) {
    public record SimilarCourse(
        Long courseId,
        String title,
        String description,
        BigDecimal durationHours,
        boolean ceEligible,
        BigDecimal relevanceScore,
        String matchType
    ) {}
}
