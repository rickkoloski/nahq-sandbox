package com.nahq.accelerate.controller;

import com.nahq.accelerate.dto.CourseSimilarityDto;
import com.nahq.accelerate.service.CourseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@Tag(name = "Learning Resources", description = "Course catalog with pgvector similarity search — same PostgreSQL instance, no Milvus")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @PostMapping("/api/courses/seed")
    @Operation(summary = "Seed course catalog with embeddings",
               description = "Creates ~40 healthcare quality courses with 384-dim synthetic embeddings and competency mappings. " +
                             "Production would use real embeddings from an embedding API.")
    public Map<String, Object> seedCourses() {
        return courseService.seedCourses();
    }

    @GetMapping("/api/courses/similar")
    @Operation(summary = "Find courses for a competency (hybrid: mapping + vector similarity)",
               description = "Returns courses mapped to the competency PLUS semantically similar courses via pgvector cosine search. " +
                             "Single SQL query combining relational joins and vector similarity on the same database.")
    public CourseSimilarityDto findSimilar(
            @RequestParam Long competencyId,
            @RequestParam(defaultValue = "5") int limit) {
        return courseService.findSimilarCourses(competencyId, limit);
    }

    @GetMapping("/api/users/{userId}/recommended-courses")
    @Operation(summary = "Recommend courses for a user's top gaps",
               description = "Identifies user's top N competency gaps, then finds courses that address those gaps. " +
                             "Gap analysis + course matching in a single flow — structured queries, no RAG pipeline.")
    public CourseSimilarityDto recommendCourses(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "3") int topGaps) {
        return courseService.findCoursesForTopGaps(userId, topGaps);
    }
}
