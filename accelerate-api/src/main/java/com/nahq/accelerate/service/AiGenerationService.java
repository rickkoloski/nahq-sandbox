package com.nahq.accelerate.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.*;

@Service
public class AiGenerationService {

    private final ContextPackagingService contextService;
    private final EntityManager em;
    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    @Value("${anthropic.api-key:}")
    private String apiKey;

    @Value("${anthropic.model:claude-sonnet-4-20250514}")
    private String model;

    public AiGenerationService(ContextPackagingService contextService, EntityManager em, ObjectMapper objectMapper) {
        this.contextService = contextService;
        this.em = em;
        this.objectMapper = objectMapper;
        this.restClient = RestClient.builder()
            .baseUrl("https://api.anthropic.com")
            .build();
    }

    @Transactional
    public Map<String, Object> generateIndividualSummary(Long userId) {
        String context = contextService.packageIndividualContext(userId);
        String systemPrompt = """
            You are a healthcare quality assessment advisor. Given a professional's competency
            assessment results, write a concise, encouraging summary (3-4 paragraphs) that:
            1. Acknowledges their strengths
            2. Identifies priority development areas with specific, actionable guidance
            3. Contextualizes their performance against national benchmarks
            4. Recommends specific next steps
            Use professional but warm tone. Reference specific competencies and scores.""";

        return generate("individual_summary", userId, null, systemPrompt, context);
    }

    @Transactional
    public Map<String, Object> generateUpskillPlan(Long userId) {
        String context = contextService.packageUpskillPlanContext(userId);
        String systemPrompt = """
            You are a healthcare quality professional development advisor. Given a professional's
            competency gaps and available courses, create a structured 6-month upskill plan that:
            1. Prioritizes the most impactful gaps to close first
            2. Maps specific courses to specific gaps
            3. Sequences learning logically (foundational before advanced)
            4. Respects the constraint of max 2 courses per quarter
            5. Includes expected outcomes for each phase
            Format as a clear timeline with Q1 and Q2 sections.""";

        return generate("upskill_plan", userId, null, systemPrompt, context);
    }

    @Transactional
    public Map<String, Object> generateOrgInsights(Long orgId) {
        String context = contextService.packageOrgContext(orgId);
        String systemPrompt = """
            You are a healthcare quality strategic advisor. Given an organization's workforce
            competency data compared to national benchmarks, write executive-level strategic
            recommendations (3-4 paragraphs) that:
            1. Summarize organizational strengths and capability gaps
            2. Identify strategic priorities for workforce development
            3. Recommend specific interventions (training programs, mentoring, etc.)
            4. Frame recommendations in terms of patient outcomes and organizational goals
            Use executive-appropriate language. Be specific about which domains need attention.""";

        return generate("org_insights", null, orgId, systemPrompt, context);
    }

    private Map<String, Object> generate(String type, Long userId, Long orgId,
                                          String systemPrompt, String structuredContext) {
        String promptHash = sha256(structuredContext);
        long start = System.currentTimeMillis();

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("generationType", type);
        result.put("structuredContext", structuredContext);

        if (apiKey == null || apiKey.isBlank()) {
            // Dry run — show the context that WOULD be sent to the LLM
            result.put("mode", "dry_run");
            result.put("message", "No API key configured. Set anthropic.api-key in application.properties. " +
                                  "The structured context above is what would be sent to the LLM — " +
                                  "this is the intelligence layer. The LLM adds narrative, not knowledge.");
            result.put("model", model);
            long elapsed = System.currentTimeMillis() - start;
            result.put("contextPackagingMs", elapsed);
            logGeneration(type, userId, orgId, promptHash, structuredContext, "[dry_run]", model, 0, 0, elapsed);
            return result;
        }

        // Call Claude API
        try {
            String userMessage = "Based on the following structured assessment data, provide your analysis:\n\n" + structuredContext;

            Map<String, Object> requestBody = Map.of(
                "model", model,
                "max_tokens", 1024,
                "system", systemPrompt,
                "messages", List.of(Map.of("role", "user", "content", userMessage))
            );

            String responseJson = restClient.post()
                .uri("/v1/messages")
                .header("x-api-key", apiKey)
                .header("anthropic-version", "2023-06-01")
                .contentType(MediaType.APPLICATION_JSON)
                .body(requestBody)
                .retrieve()
                .body(String.class);

            JsonNode response = objectMapper.readTree(responseJson);
            String text = response.at("/content/0/text").asText();
            int inputTokens = response.at("/usage/input_tokens").asInt();
            int outputTokens = response.at("/usage/output_tokens").asInt();

            long elapsed = System.currentTimeMillis() - start;

            result.put("mode", "live");
            result.put("response", text);
            result.put("model", model);
            result.put("inputTokens", inputTokens);
            result.put("outputTokens", outputTokens);
            result.put("latencyMs", elapsed);

            logGeneration(type, userId, orgId, promptHash, structuredContext, text, model, inputTokens, outputTokens, elapsed);
        } catch (Exception e) {
            long elapsed = System.currentTimeMillis() - start;
            result.put("mode", "error");
            result.put("error", e.getMessage());
            result.put("latencyMs", elapsed);
            logGeneration(type, userId, orgId, promptHash, structuredContext, "[error: " + e.getMessage() + "]", model, 0, 0, elapsed);
        }

        return result;
    }

    private void logGeneration(String type, Long userId, Long orgId, String promptHash,
                                String contextSummary, String response, String model,
                                int inputTokens, int outputTokens, long latencyMs) {
        em.createNativeQuery(
            "INSERT INTO ai_generation_log (generation_type, user_id, organization_id, prompt_hash, " +
            "context_summary, response_text, model, input_tokens, output_tokens, latency_ms) " +
            "VALUES (:type, :userId, :orgId, :hash, :context, :response, :model, :inTok, :outTok, :latency)"
        )
            .setParameter("type", type)
            .setParameter("userId", userId)
            .setParameter("orgId", orgId)
            .setParameter("hash", promptHash)
            .setParameter("context", contextSummary.length() > 2000 ? contextSummary.substring(0, 2000) : contextSummary)
            .setParameter("response", response)
            .setParameter("model", model)
            .setParameter("inTok", inputTokens)
            .setParameter("outTok", outputTokens)
            .setParameter("latency", latencyMs)
            .executeUpdate();
    }

    private static String sha256(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder();
            for (byte b : hash) hex.append(String.format("%02x", b));
            return hex.toString();
        } catch (Exception e) {
            return "hash-error";
        }
    }
}
