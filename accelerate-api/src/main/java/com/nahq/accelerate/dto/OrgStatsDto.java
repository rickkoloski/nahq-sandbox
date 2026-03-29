package com.nahq.accelerate.dto;

import java.time.Instant;

public record OrgStatsDto(
    int totalUsers,
    int assessmentsCompleted,
    int assessmentsNotStarted,
    int completionPercent,
    Instant lastAssessmentDate
) {}
