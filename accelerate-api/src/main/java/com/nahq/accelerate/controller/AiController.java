package com.nahq.accelerate.controller;

import com.nahq.accelerate.service.AiGenerationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityManager;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/ai")
@Tag(name = "AI Generation", description = "Structured context injection — domain model provides deterministic data, LLM adds narrative")
public class AiController {

    private final AiGenerationService aiService;
    private final EntityManager em;

    public AiController(AiGenerationService aiService, EntityManager em) {
        this.aiService = aiService;
        this.em = em;
    }

    @PostMapping("/individual-summary/{userId}")
    @Operation(summary = "Generate personalized assessment narrative")
    public Map<String, Object> individualSummary(@PathVariable Long userId) {
        return aiService.generateIndividualSummary(userId);
    }

    @PostMapping("/upskill-plan/{userId}")
    @Operation(summary = "Generate personalized upskill plan")
    public Map<String, Object> upskillPlan(@PathVariable Long userId) {
        return aiService.generateUpskillPlan(userId);
    }

    @PostMapping("/org-insights/{orgId}")
    @Operation(summary = "Generate organizational strategic recommendations")
    public Map<String, Object> orgInsights(@PathVariable Long orgId) {
        return aiService.generateOrgInsights(orgId);
    }

    @PostMapping("/ask")
    @Operation(summary = "Freeform AI question with structured context injection",
               description = "Accepts any prompt and injects the user's or org's structured context. " +
                             "Provide userId for individual context, orgId for organizational context.")
    public Map<String, Object> ask(@RequestBody Map<String, Object> body) {
        String prompt = (String) body.get("prompt");
        if (prompt == null || prompt.isBlank()) {
            return Map.of("error", "prompt is required");
        }
        Long userId = body.get("userId") != null ? ((Number) body.get("userId")).longValue() : null;
        Long orgId = body.get("orgId") != null ? ((Number) body.get("orgId")).longValue() : null;
        return aiService.ask(prompt, userId, orgId);
    }

    @GetMapping("/generations/{userId}")
    @Operation(summary = "Retrieve previous AI generations for a user",
               description = "Returns the most recent generation of each type for this user, avoiding re-generation and token cost.")
    public List<Map<String, Object>> getGenerations(@PathVariable Long userId) {
        // Resolve userId to partyId
        @SuppressWarnings("unchecked")
        List<Object> partyIds = em.createNativeQuery(
            "SELECT party_id FROM app_user WHERE id = :userId"
        ).setParameter("userId", userId).getResultList();

        if (partyIds.isEmpty() || partyIds.get(0) == null) return List.of();
        Long partyId = ((Number) partyIds.get(0)).longValue();

        // Get most recent generation per type
        @SuppressWarnings("unchecked")
        List<Object[]> rows = em.createNativeQuery(
            "SELECT DISTINCT ON (generation_type) " +
            "  id, generation_type, response_text, model, input_tokens, output_tokens, latency_ms, created_at " +
            "FROM ai_generation_log " +
            "WHERE party_id = :partyId AND response_text IS NOT NULL AND response_text != '[dry_run]' " +
            "ORDER BY generation_type, created_at DESC"
        ).setParameter("partyId", partyId).getResultList();

        return rows.stream().map(r -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", ((Number) r[0]).longValue());
            m.put("generationType", r[1]);
            m.put("response", r[2]);
            m.put("model", r[3]);
            m.put("inputTokens", r[4] != null ? ((Number) r[4]).intValue() : 0);
            m.put("outputTokens", r[5] != null ? ((Number) r[5]).intValue() : 0);
            m.put("latencyMs", r[6] != null ? ((Number) r[6]).longValue() : 0);
            m.put("createdAt", r[7] != null ? r[7].toString() : null);
            return m;
        }).toList();
    }
}
