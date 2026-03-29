package com.nahq.accelerate.controller;

import com.nahq.accelerate.service.SyntheticDataService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/seed")
@Tag(name = "Seed Data", description = "Generate synthetic assessment data for demonstration")
public class SeedDataController {

    private final SyntheticDataService syntheticDataService;

    public SeedDataController(SyntheticDataService syntheticDataService) {
        this.syntheticDataService = syntheticDataService;
    }

    @PostMapping("/generate")
    @Operation(summary = "Generate synthetic users, assessments, and results",
               description = "Creates organizations, users with role assignments, and scored assessments " +
                             "with realistic score distributions across 29 competencies. Deterministic (seeded RNG).")
    public Map<String, Object> generate(@RequestParam(defaultValue = "100") int userCount) {
        return syntheticDataService.generateSyntheticData(userCount);
    }
}
