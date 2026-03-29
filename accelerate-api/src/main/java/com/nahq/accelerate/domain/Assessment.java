package com.nahq.accelerate.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Entity
@Table(name = "assessment")
public class Assessment {

    public static final Map<String, Set<String>> VALID_TRANSITIONS = Map.of(
        "NOT_STARTED", Set.of("IN_PROGRESS", "CANCELLED"),
        "IN_PROGRESS", Set.of("COMPLETED", "CANCELLED"),
        "COMPLETED", Set.of("SCORED"),
        "SCORED", Set.of(),
        "CANCELLED", Set.of()
    );

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assessment_cycle_id", nullable = false)
    private AssessmentCycle assessmentCycle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "party_id")
    private Party party;

    @Column(nullable = false, length = 20)
    private String status;

    @Column(name = "started_at")
    private Instant startedAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    @Column(name = "scored_at")
    private Instant scoredAt;

    @OneToMany(mappedBy = "assessment", fetch = FetchType.LAZY)
    private List<AssessmentResult> results;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    void prePersist() { createdAt = updatedAt = Instant.now(); if (status == null) status = "NOT_STARTED"; }

    @PreUpdate
    void preUpdate() { updatedAt = Instant.now(); }

    public void transitionTo(String newStatus) {
        Set<String> allowed = VALID_TRANSITIONS.getOrDefault(this.status, Set.of());
        if (!allowed.contains(newStatus)) {
            throw new IllegalStateException("Cannot transition from " + this.status + " to " + newStatus);
        }
        this.status = newStatus;
        switch (newStatus) {
            case "IN_PROGRESS" -> this.startedAt = Instant.now();
            case "COMPLETED" -> this.completedAt = Instant.now();
            case "SCORED" -> this.scoredAt = Instant.now();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public AssessmentCycle getAssessmentCycle() { return assessmentCycle; }
    public void setAssessmentCycle(AssessmentCycle ac) { this.assessmentCycle = ac; }
    public AppUser getUser() { return user; }
    public void setUser(AppUser user) { this.user = user; }
    public Party getParty() { return party; }
    public void setParty(Party party) { this.party = party; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Instant getStartedAt() { return startedAt; }
    public Instant getCompletedAt() { return completedAt; }
    public Instant getScoredAt() { return scoredAt; }
    public void setScoredAt(Instant scoredAt) { this.scoredAt = scoredAt; }
    public List<AssessmentResult> getResults() { return results; }
}
