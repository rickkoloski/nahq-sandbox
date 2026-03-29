package com.nahq.accelerate.domain;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "role_type")
public class RoleType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(name = "internal_id", nullable = false, unique = true, length = 50)
    private String internalId;

    private String description;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void prePersist() {
        createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getInternalId() { return internalId; }
    public String getDescription() { return description; }
}
