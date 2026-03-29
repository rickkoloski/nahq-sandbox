package com.nahq.accelerate.dto;

public record PlatformStatsDto(
    int organizations,
    int users,
    int courses,
    int domains,
    int competencies
) {}
