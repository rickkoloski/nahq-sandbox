package com.nahq.accelerate.controller;

import com.nahq.accelerate.dto.GapAnalysisDto;
import com.nahq.accelerate.service.GapAnalysisService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Gap Analysis", description = "Deterministic competency gap analysis — score minus target, ranked")
public class GapAnalysisController {

    private final GapAnalysisService gapAnalysisService;

    public GapAnalysisController(GapAnalysisService gapAnalysisService) {
        this.gapAnalysisService = gapAnalysisService;
    }

    @GetMapping("/{userId}/gaps")
    @Operation(summary = "Get ranked gap analysis for a user",
               description = "Returns each competency with score, target, gap (score - target), ranked by largest deficit first. " +
                             "This is deterministic arithmetic, not LLM-generated — auditable and precise.")
    public GapAnalysisDto getGaps(@PathVariable Long userId) {
        return gapAnalysisService.analyzeGaps(userId);
    }
}
