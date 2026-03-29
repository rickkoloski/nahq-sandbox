package com.nahq.accelerate.dto;

import java.util.List;

public record LoginResponse(
    Long userId,
    String email,
    String firstName,
    String lastName,
    String organizationName,
    Long organizationId,
    List<String> roles,
    String primaryRole
) {}
