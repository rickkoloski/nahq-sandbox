package com.nahq.accelerate.service;

import com.nahq.accelerate.dto.BenchmarkComparisonDto;
import com.nahq.accelerate.dto.CourseSimilarityDto;
import com.nahq.accelerate.dto.GapAnalysisDto;
import com.nahq.accelerate.dto.OrgCapabilitySummaryDto;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

/**
 * Packages structured domain data into rich LLM context.
 * This is the core of the "structured context injection" approach:
 * deterministic data in, narrative out. No RAG retrieval needed.
 */
@Service
public class ContextPackagingService {

    private final GapAnalysisService gapService;
    private final BenchmarkService benchmarkService;
    private final CourseService courseService;

    public ContextPackagingService(GapAnalysisService gapService, BenchmarkService benchmarkService,
                                   CourseService courseService) {
        this.gapService = gapService;
        this.benchmarkService = benchmarkService;
        this.courseService = courseService;
    }

    public String packageIndividualContext(Long userId) {
        GapAnalysisDto gaps = gapService.analyzeGaps(userId);
        BenchmarkComparisonDto benchmarks = benchmarkService.getUserBenchmarks(userId);
        CourseSimilarityDto courses = courseService.findCoursesForTopGaps(userId, 3);

        var sb = new StringBuilder();
        sb.append("## Individual Profile\n");
        sb.append("- Name: ").append(gaps.userName()).append("\n");
        sb.append("- Role: ").append(gaps.roleName()).append("\n");
        sb.append("- Framework: NAHQ Healthcare Quality Competency Framework (").append(gaps.frameworkVersion()).append(")\n");
        sb.append("- Overall Score: ").append(gaps.overallScore()).append(" / Target: ").append(gaps.overallTarget());
        sb.append(" / Gap: ").append(gaps.overallGap()).append("\n\n");

        sb.append("## Top 5 Competency Gaps (largest deficit first)\n");
        gaps.gaps().stream().limit(5).forEach(g ->
            sb.append("- **").append(g.competencyName()).append("** (").append(g.domainName()).append("): ")
              .append("Score ").append(g.score()).append(" vs Target ").append(g.target())
              .append(" (gap: ").append(g.gap()).append(", target level: ").append(g.targetLevel()).append(")\n")
        );

        sb.append("\n## Top 5 Strengths (above target)\n");
        gaps.gaps().stream()
            .filter(g -> g.gap().doubleValue() > 0)
            .limit(5)
            .forEach(g ->
                sb.append("- **").append(g.competencyName()).append("**: ")
                  .append("Score ").append(g.score()).append(" vs Target ").append(g.target())
                  .append(" (+").append(g.gap()).append(")\n")
            );

        sb.append("\n## National Benchmark Comparison\n");
        benchmarks.competencies().stream()
            .filter(b -> b.percentileLabel().contains("Bottom") || b.percentileLabel().contains("Top 10"))
            .forEach(b ->
                sb.append("- ").append(b.competencyName()).append(": ").append(b.percentileLabel())
                  .append(" (score ").append(b.userScore()).append(", national median ").append(b.nationalP50()).append(")\n")
            );

        sb.append("\n## Recommended Courses (targeting top gaps)\n");
        courses.courses().stream().limit(5).forEach(c ->
            sb.append("- ").append(c.title())
              .append(c.ceEligible() ? " [CE Eligible]" : "")
              .append(" (").append(c.durationHours()).append(" hrs)\n")
        );

        return sb.toString();
    }

    public String packageOrgContext(Long orgId) {
        OrgCapabilitySummaryDto orgSummary = benchmarkService.getOrgCapability(orgId);

        var sb = new StringBuilder();
        sb.append("## Organization Profile\n");
        sb.append("- Name: ").append(orgSummary.organizationName()).append("\n");
        sb.append("- Total Participants: ").append(orgSummary.totalParticipants()).append("\n");
        sb.append("- Overall Avg Score: ").append(orgSummary.overallOrgAvg());
        sb.append(" vs National Avg: ").append(orgSummary.overallNationalAvg()).append("\n\n");

        sb.append("## Domain Performance vs National Benchmarks\n");
        orgSummary.domains().forEach(d ->
            sb.append("- **").append(d.domainName()).append("**: ")
              .append("Org avg ").append(d.orgAvgScore())
              .append(" vs National avg ").append(d.nationalMean())
              .append(" — ").append(d.vsNational())
              .append(" (").append(d.participantCount()).append(" participants)\n")
        );

        sb.append("\n## Domains Below National Average\n");
        orgSummary.domains().stream()
            .filter(d -> d.orgAvgScore().compareTo(d.nationalMean()) < 0)
            .forEach(d ->
                sb.append("- ").append(d.domainName()).append(": gap of ")
                  .append(d.orgAvgScore().subtract(d.nationalMean())).append("\n")
            );

        return sb.toString();
    }

    public String packageUpskillPlanContext(Long userId) {
        GapAnalysisDto gaps = gapService.analyzeGaps(userId);
        CourseSimilarityDto courses = courseService.findCoursesForTopGaps(userId, 5);

        var sb = new StringBuilder();
        sb.append("## Upskill Plan Context\n");
        sb.append("- Name: ").append(gaps.userName()).append("\n");
        sb.append("- Role: ").append(gaps.roleName()).append("\n\n");

        sb.append("## Priority Competency Gaps (top 5)\n");
        var topGaps = gaps.gaps().stream().limit(5).toList();
        for (int i = 0; i < topGaps.size(); i++) {
            var g = topGaps.get(i);
            sb.append(i + 1).append(". **").append(g.competencyName()).append("** (").append(g.domainName()).append(")\n");
            sb.append("   - Current: ").append(g.score()).append(" | Target: ").append(g.target());
            sb.append(" | Gap: ").append(g.gap()).append(" | Level needed: ").append(g.targetLevel()).append("\n");
        }

        sb.append("\n## Available Courses Addressing These Gaps\n");
        courses.courses().forEach(c ->
            sb.append("- ").append(c.title())
              .append(c.ceEligible() ? " [CE]" : "")
              .append(" — ").append(c.durationHours()).append(" hrs")
              .append(" (relevance: ").append(c.relevanceScore()).append(")\n")
        );

        sb.append("\n## Constraints\n");
        sb.append("- Plan should be achievable within 6 months\n");
        sb.append("- Prioritize CE-eligible courses where available\n");
        sb.append("- Maximum 2 courses per quarter to avoid overload\n");

        return sb.toString();
    }
}
