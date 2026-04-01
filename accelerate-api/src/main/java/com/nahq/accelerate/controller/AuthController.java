package com.nahq.accelerate.controller;

import com.nahq.accelerate.dto.LoginResponse;
import com.nahq.accelerate.service.OrganizationHierarchyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityManager;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Sandbox login — production would use Entra ID OAuth2")
public class AuthController {

    private final EntityManager em;
    private final OrganizationHierarchyService hierarchyService;

    public AuthController(EntityManager em, OrganizationHierarchyService hierarchyService) {
        this.em = em;
        this.hierarchyService = hierarchyService;
    }

    @PostMapping("/login")
    @Operation(summary = "Login by email (sandbox mode — no password)",
               description = "Looks up user by email, resolves identity via Party → Individual, " +
                             "roles via PartyRole, org via PartyRelationship (EMPLOYED_BY). " +
                             "Includes healthSystemOrgId — the top-level org in the hierarchy, " +
                             "resolved via the OrganizationHierarchyService decorator.")
    public ResponseEntity<LoginResponse> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        // User → Party → Individual (names) + PartyRole (roles) + PartyRelationship (org)
        @SuppressWarnings("unchecked")
        List<Object[]> rows = em.createNativeQuery(
            "SELECT u.id, u.email, i.first_name, i.last_name, " +
            "       o.name AS org_name, o.id AS org_id, rt.internal_id AS role " +
            "FROM app_user u " +
            "JOIN party p ON u.party_id = p.id " +
            "LEFT JOIN individual i ON i.party_id = p.id " +
            "LEFT JOIN party_role pr ON p.id = pr.party_id AND pr.thru_date IS NULL " +
            "LEFT JOIN role_type rt ON pr.role_type_id = rt.id " +
            "LEFT JOIN party_relationship emp ON emp.from_party_id = p.id AND emp.thru_date IS NULL " +
            "LEFT JOIN party_relationship_type emprt ON emp.relationship_type_id = emprt.id AND emprt.internal_id = 'employed_by' " +
            "LEFT JOIN organization o ON o.party_id = emp.to_party_id AND emprt.id IS NOT NULL " +
            "WHERE LOWER(u.email) = LOWER(:email) AND u.status = 'ACTIVE'"
        ).setParameter("email", email.trim()).getResultList();

        if (rows.isEmpty()) {
            return ResponseEntity.status(401).build();
        }

        Object[] first = rows.get(0);
        List<String> roles = rows.stream()
            .map(r -> (String) r[6])
            .filter(Objects::nonNull)
            .distinct()
            .toList();

        String primaryRole = roles.contains("admin") ? "admin"
            : roles.contains("executive") ? "executive"
            : roles.contains("participant") ? "participant"
            : "unknown";

        Long directOrgId = first[5] != null ? ((Number) first[5]).longValue() : null;
        Long healthSystemOrgId = hierarchyService.resolveHealthSystem(directOrgId);

        // Admin users may not be employed — fall back to the first health system
        if (healthSystemOrgId == null && roles.contains("admin")) {
            @SuppressWarnings("unchecked")
            List<Object> firstOrg = em.createNativeQuery(
                "SELECT DISTINCT o.id FROM organization o " +
                "JOIN party p ON o.party_id = p.id " +
                "JOIN party_relationship pr ON pr.to_party_id = p.id " +
                "JOIN party_relationship_type prt ON pr.relationship_type_id = prt.id " +
                "WHERE prt.internal_id = 'subsidiary_of' AND pr.thru_date IS NULL " +
                "ORDER BY o.id LIMIT 1"
            ).getResultList();
            if (!firstOrg.isEmpty()) {
                healthSystemOrgId = ((Number) firstOrg.get(0)).longValue();
            }
        }

        return ResponseEntity.ok(new LoginResponse(
            ((Number) first[0]).longValue(),
            (String) first[1],
            (String) first[2],
            (String) first[3],
            (String) first[4],
            directOrgId,
            healthSystemOrgId,
            roles,
            primaryRole
        ));
    }
}
