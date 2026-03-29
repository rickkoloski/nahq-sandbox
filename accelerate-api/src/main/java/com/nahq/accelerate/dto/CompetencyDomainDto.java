package com.nahq.accelerate.dto;

import com.nahq.accelerate.domain.CompetencyDomain;
import java.util.List;

public record CompetencyDomainDto(
    Long id,
    String name,
    String description,
    int displayOrder,
    List<CompetencyDto> competencies
) {
    public static CompetencyDomainDto from(CompetencyDomain domain) {
        return new CompetencyDomainDto(
            domain.getId(),
            domain.getName(),
            domain.getDescription(),
            domain.getDisplayOrder(),
            domain.getCompetencies().stream().map(CompetencyDto::from).toList()
        );
    }
}
