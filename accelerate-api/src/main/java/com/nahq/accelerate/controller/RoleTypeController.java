package com.nahq.accelerate.controller;

import com.nahq.accelerate.domain.RoleType;
import com.nahq.accelerate.repository.RoleTypeRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@Tag(name = "Role Types", description = "Role type catalog — temporal multi-role assignments")
public class RoleTypeController {

    private final RoleTypeRepository roleTypeRepository;

    public RoleTypeController(RoleTypeRepository roleTypeRepository) {
        this.roleTypeRepository = roleTypeRepository;
    }

    @GetMapping
    @Operation(summary = "List all role types")
    public List<RoleType> listRoles() {
        return roleTypeRepository.findAll();
    }
}
