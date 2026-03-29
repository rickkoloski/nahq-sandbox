package com.nahq.accelerate.dto;

import java.math.BigDecimal;
import java.util.List;

public record OrgCapabilitySummaryDto(
    Long organizationId,
    String organizationName,
    List<DomainSummary> domains,
    BigDecimal overallOrgAvg,
    BigDecimal overallNationalAvg,
    int totalParticipants,
    long queryTimeMs
) {
    public record DomainSummary(
        Long domainId,
        String domainName,
        BigDecimal orgAvgScore,
        BigDecimal nationalP50,
        BigDecimal nationalMean,
        int participantCount,
        String vsNational
    ) {}
}
