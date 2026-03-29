package com.nahq.accelerate.domain;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "competency_framework_version")
public class CompetencyFrameworkVersion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "version_label", nullable = false, unique = true, length = 50)
    private String versionLabel;

    @Column(nullable = false, length = 20)
    private String status;

    @Column(name = "published_at")
    private Instant publishedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    void prePersist() {
        createdAt = updatedAt = Instant.now();
    }

    public Long getId() { return id; }
    public String getVersionLabel() { return versionLabel; }
    public String getStatus() { return status; }
    public Instant getPublishedAt() { return publishedAt; }
}
