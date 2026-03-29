# NAHQ Accelerate — Auth Architecture Analysis & Questions for Tim

**Date:** March 28, 2026
**Status:** WIP — questions to discuss with Tim before finalizing D6

---

## MB's Auth Design

Three identity layers for three user roles:

```
NAHQ Admins ──→ Microsoft Entra ID ──→ Auth0 (broker) ──→ App
Hospital Execs ──→ Nimble (Salesforce) ──→ Auth0 (broker) ──→ App
Participants ──→ Nimble (Salesforce) ──→ Auth0 (broker) ──→ App
```

Auth0 sits in the middle as a federation hub, normalizing tokens from Entra ID and Nimble into a single auth flow for the application.

### Why We're Questioning This

**Entra ID already provides multi-org federation natively.** Azure AD B2B (business-to-business) allows external organizations to authenticate against the app using their own Entra tenants. Azure AD B2C (business-to-consumer) handles custom login flows for individual users who may not have an organizational IdP.

NAHQ's end customers are healthcare systems — overwhelmingly Microsoft shops. Their IT departments already manage users in Entra. Adding Auth0 as a broker between Entra and the app introduces:

- An additional vendor dependency ($200+/mo at scale)
- A second identity system to configure, monitor, and troubleshoot
- Token translation complexity (Entra token → Auth0 token → app token)
- HIPAA BAA required with Auth0 in addition to Microsoft's existing BAA
- A second attack surface in the auth chain

### When Auth0 Would Be Justified

1. **Non-Microsoft IdPs** — if some hospitals use Okta, Ping, or Google Workspace, Auth0 can normalize across IdP vendors. But at MVP with known Microsoft-shop customers, this is premature.
2. **Nimble as identity source** — if Nimble (Salesforce AMS) is the source of truth for participant identity AND it can't federate via standard OIDC/SAML, Auth0 might be needed as translation layer. **This is the key question.**
3. **Custom login flows** — if participants need passwordless, magic link, or social login options that Entra B2C doesn't support. Unlikely for healthcare quality professionals at established health systems.
4. **5+ distinct IdP integrations** — at scale, a broker simplifies federation management. Not applicable at MVP with 1-3 customer organizations.

### Our Counter-Position

For MVP (200 users, 1-3 healthcare orgs):

```
NAHQ Admins ──→ Entra ID (NAHQ tenant) ──→ Spring Security ──→ App
Hospital Execs ──→ Entra ID (hospital tenant via B2B) ──→ Spring Security ──→ App
Participants ──→ [NEEDS CLARIFICATION — see questions below]
```

Spring Security's OAuth2 Resource Server validates Entra ID tokens directly. No broker. Hospital organizations federate via Entra B2B — their IT departments add the NAHQ app as an enterprise application, users authenticate with their existing hospital credentials.

**Graduation trigger:** If >5 distinct IdP vendors (not orgs — vendors) need federation, evaluate Auth0 or a similar broker. This is a runtime configuration change, not an architectural one, because Spring Security abstracts the token validation layer.

---

## The Nimble Question

Nimble AMS (built on Salesforce) is described in the architecture docs as handling:
- CRM / member data management
- Assessment data storage
- **User auth for non-admin users**

This is the piece we don't understand. Nimble is an Association Management System, not an identity provider. It stores member profiles, manages memberships, tracks event registrations. But "user auth via Nimble" could mean several things:

### Possibility A: Nimble as Profile Store Only
- Users authenticate via their hospital's Entra ID (or email/password)
- Nimble stores their NAHQ membership profile, assessment history, etc.
- Auth and identity are separate from Nimble
- **Implication:** No special auth integration needed with Nimble. Just API sync for profile data.

### Possibility B: Nimble SSO (Salesforce Identity)
- Nimble runs on Salesforce, which has its own OIDC/SAML capabilities
- Participants could authenticate via Salesforce Identity (Nimble's underlying platform)
- **Implication:** Standard OIDC flow. Spring Security can validate Salesforce-issued tokens directly. No Auth0 needed.

### Possibility C: Nimble as User Directory + Custom Auth
- NAHQ manages participant accounts in Nimble (email, role, org assignment)
- The app uses Nimble's API to verify credentials or look up user records
- Authentication is a custom flow: app checks Nimble for user existence, then issues its own session
- **Implication:** Custom integration. This is where Auth0 might add value as a custom connection, but it could also be handled directly in Spring Security with a custom UserDetailsService.

### Possibility D: No Current Auth — It's Manual
- The existing Workforce Accelerator doesn't have a digital platform. It's spreadsheets, Power BI, and Qualtrics surveys.
- "Auth via Nimble" is aspirational, not implemented.
- Participants are currently identified by email in Qualtrics responses and matched to Nimble records manually.
- **Implication:** Greenfield auth design. We can choose the simplest path.

---

## RBAC Comparison

| Aspect | MB Design | Our Design |
|--------|-----------|------------|
| Model | `Users.role` — single enum (Admin, Executive, Participant) | `user_role` join table + `role_type` catalog |
| Multi-role | No — one role per user | Yes — a user can hold multiple roles simultaneously |
| Temporal | No — current role only, overwrites history | Yes — `from_date`/`thru_date` on each role assignment |
| New roles | Schema migration (add enum value) | Data insert (add row to `role_type`) |
| Audit | No — "who had Executive access in Q1?" unanswerable | Yes — queryable role history |
| Multi-tenant | Unclear — how does org context attach to roles? | `user_role` can carry `organization_id` for org-scoped roles |

Our RBAC model is materially stronger. MB's own data model doc flags the single enum as "preferably normalized into a Role entity in future iterations." We've already designed that normalization.

### Open RBAC Question
- **Org-scoped roles:** Can a user be an Executive at Tampa General and a Participant at Lifepoint? The engagement model suggests cohorts are org-scoped, but the role model doesn't capture this. Our `user_role` table should include an optional `organization_id` to support org-scoped role assignments.

---

## Questions for Tim

### Auth Flow
1. **How do individual participants authenticate today?** Is there a digital login, or is it all manual (Qualtrics link via email, results matched by email address)?
2. **What role does Nimble actually play in auth?** Is it the identity provider, just the profile store, or aspirational?
3. **Do hospital IT departments need to be involved in user provisioning?** Or does NAHQ bulk-import users and send invite emails?
4. **Has any hospital customer expressed a preference for SSO via their own IdP?** (This determines whether B2B federation is a real requirement or theoretical.)
5. **Why was Auth0 selected over Entra B2B/B2C?** Was this MB's recommendation? Was it evaluated against Microsoft's native multi-org federation?

### Identity & Tenancy
6. **Can a user belong to multiple organizations?** (e.g., a quality consultant working with two health systems)
7. **Who manages user accounts?** NAHQ admins? Hospital HR? Self-registration?
8. **What happens when a participant leaves their hospital?** Is the account deactivated? By whom?
9. **Is there a concept of "org admin" at the hospital level?** (Someone at Tampa General who manages their own users, distinct from NAHQ admin)

### Nimble Integration
10. **What data lives in Nimble vs. the Accelerate platform?** Is Nimble the system of record for user profiles, or does Accelerate maintain its own user store?
11. **What APIs does Nimble expose?** REST? SOAP? Salesforce-standard APIs?
12. **Is there a data sync pattern, or does the app query Nimble in real-time?**
13. **Who has Nimble admin access?** NAHQ only, or do hospital orgs have visibility into their member records?

### Compliance
14. **HIPAA BAA status:** Does NAHQ have a BAA with Auth0? With Nimble/Salesforce? Are assessment results considered PHI?
15. **Data residency:** Any requirements on where auth tokens and user data are stored geographically?

---

## Impact on Sandbox Plan

D6 should split:

**D6a: Auth Architecture Spike (before code)**
- Get answers to questions 1-5 and 10-12 from Tim
- Determine: Entra-only, Entra + Salesforce OIDC, or Entra + custom Nimble integration
- Document the auth flow diagram with actual technology choices
- Estimate: 1-2 days once Tim responds

**D6b: Auth Implementation**
- Spring Security OAuth2 Resource Server config
- Entra ID app registration
- Whatever the Nimble integration turns out to be
- RBAC from `user_role` table
- Estimate: 2-3 days

This is the kind of risk that should have been resolved in Elaboration (S2-S3), not deferred to Phase 1 build. It's one of our key observations from the architecture review.
