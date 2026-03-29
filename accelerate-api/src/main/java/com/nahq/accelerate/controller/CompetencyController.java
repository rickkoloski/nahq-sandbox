package com.nahq.accelerate.controller;

import com.nahq.accelerate.dto.CompetencyDomainDto;
import com.nahq.accelerate.repository.CompetencyDomainRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/competencies")
@Tag(name = "Competency Framework", description = "NAHQ Healthcare Quality Competency Framework — 8 domains, 29 competencies")
public class CompetencyController {

    private final CompetencyDomainRepository domainRepository;

    public CompetencyController(CompetencyDomainRepository domainRepository) {
        this.domainRepository = domainRepository;
    }

    @GetMapping
    @Transactional(readOnly = true)
    @Operation(summary = "List all competency domains with their competencies")
    public List<CompetencyDomainDto> listDomains() {
        return domainRepository.findAllByOrderByDisplayOrder()
            .stream()
            .map(CompetencyDomainDto::from)
            .toList();
    }

    @GetMapping("/{domainId}")
    @Transactional(readOnly = true)
    @Operation(summary = "Get a single competency domain with its competencies")
    public CompetencyDomainDto getDomain(@PathVariable Long domainId) {
        return domainRepository.findById(domainId)
            .map(CompetencyDomainDto::from)
            .orElseThrow(() -> new RuntimeException("Domain not found: " + domainId));
    }
}
