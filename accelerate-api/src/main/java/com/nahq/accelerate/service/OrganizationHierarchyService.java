package com.nahq.accelerate.service;

import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

/**
 * Decorator over the generic Party/Relationship model that provides
 * organization-hierarchy-aware operations.
 *
 * The Silverston Party model is intentionally generic — Party, PartyRole,
 * PartyRelationship are abstract constructs. This service adds the business-specific
 * semantics of "health system," "subsidiary site," and "organizational scope" without
 * constraining the underlying plumbing.
 *
 * Backed by PostgreSQL functions (V11__org_hierarchy_functions.sql) for performance.
 * Currently supports one level of hierarchy (Health System → Hospital Sites).
 * Extending to N levels requires replacing the DB functions with recursive CTEs;
 * this service's API would remain unchanged.
 */
@Service
public class OrganizationHierarchyService {

    private final EntityManager em;

    public OrganizationHierarchyService(EntityManager em) {
        this.em = em;
    }

    /**
     * Resolves the top-level health system org for any org in the hierarchy.
     * If the given org IS the top-level, returns itself.
     *
     * Use case: determining which org to use for system-wide dashboards
     * when the user's direct org is a subsidiary.
     */
    @Transactional(readOnly = true)
    public Long resolveHealthSystem(Long orgId) {
        if (orgId == null) return null;
        Object result = em.createNativeQuery(
            "SELECT resolve_health_system(:orgId)"
        ).setParameter("orgId", orgId).getSingleResult();
        return ((Number) result).longValue();
    }

    /**
     * Returns the set of org IDs that constitute this org's scope:
     * the org itself plus all its direct subsidiaries.
     *
     * This is the fundamental building block for all org-scoped queries.
     * A parent org gets system-wide scope; a leaf org gets just itself.
     *
     * Use case: WHERE organization_id IN (:scope) in any org-level aggregation.
     */
    @Transactional(readOnly = true)
    public Set<Long> getOrgScope(Long orgId) {
        @SuppressWarnings("unchecked")
        List<Object> ids = em.createNativeQuery(
            "SELECT * FROM org_with_subsidiaries(:orgId)"
        ).setParameter("orgId", orgId).getResultList();

        Set<Long> scope = new LinkedHashSet<>();
        for (Object id : ids) {
            scope.add(((Number) id).longValue());
        }
        return scope;
    }

    /**
     * Returns subsidiary orgs for the given parent, with metadata.
     * Returns empty list if the org has no subsidiaries.
     *
     * Use case: populating hospital filter dropdowns, competency matrix groupBy=site.
     */
    @Transactional(readOnly = true)
    public List<SubsidiaryOrg> getSubsidiaries(Long orgId) {
        @SuppressWarnings("unchecked")
        List<Object[]> rows = em.createNativeQuery(
            "SELECT o_sub.id, o_sub.name, o_sub.org_type " +
            "FROM organization o_sub " +
            "JOIN party p_sub ON o_sub.party_id = p_sub.id " +
            "JOIN party_relationship pr ON pr.from_party_id = p_sub.id " +
            "JOIN party_relationship_type prt ON pr.relationship_type_id = prt.id " +
            "WHERE prt.internal_id = 'subsidiary_of' " +
            "AND pr.thru_date IS NULL " +
            "AND pr.to_party_id = (SELECT party_id FROM organization WHERE id = :orgId) " +
            "ORDER BY o_sub.name"
        ).setParameter("orgId", orgId).getResultList();

        return rows.stream().map(r -> new SubsidiaryOrg(
            ((Number) r[0]).longValue(),
            (String) r[1],
            (String) r[2]
        )).toList();
    }

    /**
     * Returns the org name for a given org ID.
     */
    @Transactional(readOnly = true)
    public String getOrgName(Long orgId) {
        @SuppressWarnings("unchecked")
        List<Object> names = em.createNativeQuery(
            "SELECT name FROM organization WHERE id = :orgId"
        ).setParameter("orgId", orgId).getResultList();
        return names.isEmpty() ? "Unknown" : (String) names.get(0);
    }

    public record SubsidiaryOrg(Long id, String name, String orgType) {}
}
