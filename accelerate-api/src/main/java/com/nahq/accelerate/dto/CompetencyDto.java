package com.nahq.accelerate.dto;

import com.nahq.accelerate.domain.Competency;

public record CompetencyDto(
    Long id,
    String name,
    String description,
    int displayOrder
) {
    public static CompetencyDto from(Competency c) {
        return new CompetencyDto(c.getId(), c.getName(), c.getDescription(), c.getDisplayOrder());
    }
}
