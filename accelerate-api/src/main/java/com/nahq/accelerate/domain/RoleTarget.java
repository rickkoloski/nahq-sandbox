package com.nahq.accelerate.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "role_target")
public class RoleTarget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_type_id", nullable = false)
    private RoleType roleType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "competency_id", nullable = false)
    private Competency competency;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "framework_version_id", nullable = false)
    private CompetencyFrameworkVersion frameworkVersion;

    @Column(name = "target_level", nullable = false, length = 20)
    private String targetLevel;

    @Column(name = "target_score", precision = 4, scale = 2)
    private BigDecimal targetScore;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void prePersist() { createdAt = Instant.now(); }

    public Long getId() { return id; }
    public RoleType getRoleType() { return roleType; }
    public Competency getCompetency() { return competency; }
    public CompetencyFrameworkVersion getFrameworkVersion() { return frameworkVersion; }
    public String getTargetLevel() { return targetLevel; }
    public BigDecimal getTargetScore() { return targetScore; }
}
