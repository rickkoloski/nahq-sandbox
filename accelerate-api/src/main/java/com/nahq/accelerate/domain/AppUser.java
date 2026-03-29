package com.nahq.accelerate.domain;

import jakarta.persistence.*;
import java.time.Instant;

/**
 * Auth-only entity. Identity lives in Party → Individual.
 * Org membership lives in PartyRelationship (EMPLOYED_BY).
 * User is how you get in the door; Party is who you are.
 */
@Entity
@Table(name = "app_user")
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "party_id", nullable = false)
    private Party party;

    @Column(nullable = false, length = 20)
    private String status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    void prePersist() { createdAt = updatedAt = Instant.now(); status = status != null ? status : "ACTIVE"; }

    @PreUpdate
    void preUpdate() { updatedAt = Instant.now(); }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Party getParty() { return party; }
    public void setParty(Party party) { this.party = party; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
