package com.nahq.accelerate.controller;

import com.nahq.accelerate.dto.BenchmarkComparisonDto;
import com.nahq.accelerate.dto.OrgCapabilitySummaryDto;
import com.nahq.accelerate.service.BenchmarkService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@Tag(name = "Benchmarking & Analytics", description = "National benchmarks and org capability — PostgreSQL materialized views, no Snowflake")
public class BenchmarkController {

    private final BenchmarkService benchmarkService;

    public BenchmarkController(BenchmarkService benchmarkService) {
        this.benchmarkService = benchmarkService;
    }

    @GetMapping("/api/users/{userId}/benchmarks")
    @Operation(summary = "Compare user scores against national benchmarks",
               description = "Returns each competency with user score vs P25/P50/P75/P90 percentiles. " +
                             "Reads from materialized views — sub-50ms response time. Includes query timing.")
    public BenchmarkComparisonDto getUserBenchmarks(@PathVariable Long userId) {
        return benchmarkService.getUserBenchmarks(userId);
    }

    @GetMapping("/api/organizations/{orgId}/capability-summary")
    @Operation(summary = "Organization capability summary vs national averages",
               description = "Aggregated scores by domain for an organization, compared to national benchmarks. " +
                             "All computed from PostgreSQL materialized views.")
    public OrgCapabilitySummaryDto getOrgCapability(@PathVariable Long orgId) {
        return benchmarkService.getOrgCapability(orgId);
    }

    @PostMapping("/api/analytics/refresh")
    @Operation(summary = "Refresh all materialized views",
               description = "Concurrently refreshes all 4 materialized views. Returns refresh timing.")
    public Map<String, Object> refreshViews() {
        return benchmarkService.refreshViews();
    }
}
