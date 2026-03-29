package com.nahq.accelerate.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "assessment_cycle")
public class AssessmentCycle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "engagement_id", nullable = false)
    private Engagement engagement;

    @Column(nullable = false, length = 200)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "framework_version_id", nullable = false)
    private CompetencyFrameworkVersion frameworkVersion;

    @Column(name = "open_date")
    private LocalDate openDate;

    @Column(name = "close_date")
    private LocalDate closeDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    void prePersist() { createdAt = updatedAt = Instant.now(); }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Engagement getEngagement() { return engagement; }
    public void setEngagement(Engagement engagement) { this.engagement = engagement; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public CompetencyFrameworkVersion getFrameworkVersion() { return frameworkVersion; }
    public void setFrameworkVersion(CompetencyFrameworkVersion fv) { this.frameworkVersion = fv; }
    public LocalDate getOpenDate() { return openDate; }
    public void setOpenDate(LocalDate d) { this.openDate = d; }
    public LocalDate getCloseDate() { return closeDate; }
    public void setCloseDate(LocalDate d) { this.closeDate = d; }
}
