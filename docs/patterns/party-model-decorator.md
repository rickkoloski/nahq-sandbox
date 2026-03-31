# Pattern: Party Model Decorator Layer

**Context:** Silverston Universal Data Models (Party/Role/Relationship)
**Status:** Implemented and tested in NAHQ Accelerate sandbox
**Date:** March 31, 2026

## Problem

The Silverston Party model is intentionally generic. Party, PartyRole, and PartyRelationship are abstract constructs that can represent any organizational structure — health systems, subsidiaries, employment, credentialing, etc.

This generality is a strength at the data layer, but it creates a recurring problem: every business query that needs "all people in this health system" or "the top-level org for this user" must re-implement the same relationship traversal logic. This leads to:

- Duplicated subqueries scattered across controllers and services
- Fallback/two-pass query patterns when the caller doesn't know where they are in the hierarchy
- Frontend waterfalls that probe the hierarchy before making the "real" API calls
- Fragile assumptions about hierarchy depth baked into SQL strings

## Solution

Introduce a **decorator service** that sits between the generic Party model and business-specific consumers. The decorator provides purpose-specific operations (e.g., "resolve the health system," "get this org's full scope") without constraining the underlying plumbing.

### Architecture

```
┌─────────────────────────────────────┐
│  Controllers / Business Services    │  ← call decorator, not raw Party queries
├─────────────────────────────────────┤
│  OrganizationHierarchyService       │  ← decorator: business-specific operations
├─────────────────────────────────────┤
│  PostgreSQL Functions               │  ← performance backing for hierarchy traversal
│  (resolve_health_system,            │
│   org_with_subsidiaries)            │
├─────────────────────────────────────┤
│  Party / PartyRelationship tables   │  ← generic Silverston model, unchanged
└─────────────────────────────────────┘
```

### Components

**1. PostgreSQL functions (V11__org_hierarchy_functions.sql)**

Encapsulate hierarchy traversal at the database level for performance:

- `resolve_health_system(org_id)` — walks subsidiary_of up to the root org
- `org_with_subsidiaries(org_id)` — returns self + all direct subsidiaries

These are `STABLE` functions, safe for use inside WHERE clauses and JOINs.

**2. OrganizationHierarchyService (Java service)**

The decorator itself. Expresses business intent in the application layer:

- `resolveHealthSystem(orgId)` — "which top-level org does this org belong to?"
- `getOrgScope(orgId)` — "give me all org IDs I should include in an aggregate query"
- `getSubsidiaries(orgId)` — "what are this org's child sites?"
- `getOrgName(orgId)` — convenience lookup

**3. Consumer pattern**

All org-scoped queries use the decorator or its backing DB functions:

```java
// In a controller or service:
Set<Long> scope = hierarchyService.getOrgScope(orgId);

// In a native query:
"WHERE o.id IN (SELECT * FROM org_with_subsidiaries(:orgId))"
```

### Auth integration

The login response includes `healthSystemOrgId` — resolved once at login via `hierarchyService.resolveHealthSystem()`. This means:

- The frontend knows the top-level org immediately after login
- System-wide dashboards use `healthSystemOrgId` directly
- No waterfall of "check sites → check parent → load data"

## Why This Pattern

1. **Single source of truth** for hierarchy logic — one service, not scattered subqueries
2. **Transparent aggregation** — callers ask for org 1's data; whether org 1 has direct employees or only subsidiaries is handled internally
3. **Clean extension point** — adding N-level hierarchy support means updating the DB functions (to recursive CTEs) and the service; no consumer changes
4. **Testable in isolation** — the hierarchy service can be unit tested independently of the consuming queries
5. **Preserves the generic model** — Party/PartyRelationship tables and repositories remain abstract; business semantics live only in the decorator

## Applicability Beyond NAHQ

This pattern applies anywhere the Silverston Party model is used with hierarchical organizations:

- Multi-site health systems (NAHQ)
- Corporate structures with subsidiaries
- Franchise/affiliate models
- Regional hierarchies (country → state → facility)

The decorator API stays the same; the DB functions adapt to the specific relationship types in use (subsidiary_of, division_of, franchise_of, etc.).

## Current Limitations

- Supports one level of hierarchy (parent → direct subsidiaries). Extending to N levels requires replacing the SQL functions with recursive CTEs.
- `org_with_subsidiaries` does not deduplicate if an org appears in multiple relationship chains. Not an issue with current data but would need handling for complex hierarchies.
- The materialized views (`mv_org_domain_summary`, etc.) are still per-org; the aggregation happens at query time. For very large hierarchies, pre-aggregated parent-level MVs would improve performance.

## Files

| File | Purpose |
|------|---------|
| `V11__org_hierarchy_functions.sql` | PostgreSQL functions for hierarchy traversal |
| `OrganizationHierarchyService.java` | Decorator service — business-specific org operations |
| `AuthController.java` | Login response includes `healthSystemOrgId` |
| `BenchmarkService.java` | Uses `org_with_subsidiaries()` for capability summary |
| `StatsController.java` | Uses `org_with_subsidiaries()` for org stats |
| `CompetencyMatrixController.java` | Uses `hierarchyService.getSubsidiaries()` for site grouping |
