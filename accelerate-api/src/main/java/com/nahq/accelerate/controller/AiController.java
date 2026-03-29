package com.nahq.accelerate.controller;

import com.nahq.accelerate.service.AiGenerationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@Tag(name = "AI Generation", description = "Structured context injection — domain model provides deterministic data, LLM adds narrative")
public class AiController {

    private final AiGenerationService aiService;

    public AiController(AiGenerationService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/individual-summary/{userId}")
    @Operation(summary = "Generate personalized assessment narrative",
               description = "Packages user's gaps, benchmarks, and course recommendations into structured context, " +
                             "then sends to Claude for narrative generation. Without API key, returns the structured context " +
                             "as a dry run — proving the intelligence is in the data, not the retrieval.")
    public Map<String, Object> individualSummary(@PathVariable Long userId) {
        return aiService.generateIndividualSummary(userId);
    }

    @PostMapping("/upskill-plan/{userId}")
    @Operation(summary = "Generate personalized upskill plan",
               description = "Identifies top competency gaps, maps to available courses, and generates a structured " +
                             "6-month development plan. All inputs are deterministic structured queries.")
    public Map<String, Object> upskillPlan(@PathVariable Long userId) {
        return aiService.generateUpskillPlan(userId);
    }

    @PostMapping("/org-insights/{orgId}")
    @Operation(summary = "Generate organizational strategic recommendations",
               description = "Aggregates org capability data vs national benchmarks and generates executive-level " +
                             "strategic recommendations. Structured data in, narrative out.")
    public Map<String, Object> orgInsights(@PathVariable Long orgId) {
        return aiService.generateOrgInsights(orgId);
    }
}
