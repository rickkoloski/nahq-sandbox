# Nimble AMS (Salesforce) API Research

**Date:** March 31, 2026
**Purpose:** Technical reference for NAHQ Accelerate integration with Nimble AMS
**Context:** NAHQ uses Nimble AMS as their Association Management System (system of record for members, organizations, memberships, certifications). Nimble AMS is a managed Salesforce package. This document captures what we learned about available APIs, authentication, data model, and integration patterns.

---

## Table of Contents

1. [Nimble AMS Platform Overview](#1-nimble-ams-platform-overview)
2. [Three Integration Paths](#2-three-integration-paths)
3. [Path A: Salesforce REST API (Standard)](#3-path-a-salesforce-rest-api-standard)
4. [Path B: Nimble Fuse Integration API](#4-path-b-nimble-fuse-integration-api)
5. [Path C: NAMS REST API Framework](#5-path-c-nams-rest-api-framework)
6. [Authentication and Connected Apps](#6-authentication-and-connected-apps)
7. [Nimble AMS Data Model](#7-nimble-ams-data-model)
8. [Programs (Certification/Accreditation)](#8-programs-certificationaccreditation)
9. [Rate Limits](#9-rate-limits)
10. [Nimble Apex API (Extensibility)](#10-nimble-apex-api-extensibility)
11. [Integration Approach for NAHQ Accelerate](#11-integration-approach-for-nahq-accelerate)
12. [Open Questions for Tim/NAHQ](#12-open-questions-for-timnahq)
13. [Sources](#13-sources)

---

## 1. Nimble AMS Platform Overview

**Nimble AMS** (by Momentive Software, formerly NimbleUser) is an enterprise Association Management System built entirely on the Salesforce platform. First launched in 2012, it is distributed as a **Salesforce managed package**.

**Key facts from the AppExchange listing:**
- **Namespace prefix:** `NU`
- **Current version:** NU 52.4.0 Winter 2026
- **Package ID:** 033U0000000TpK9IAK
- **Custom objects:** 157
- **Custom tabs:** 81
- **Supported editions:** Enterprise, Unlimited, Force.com, Performance
- **Pricing:** Starting at $180/user/month

**Core feature areas:** Membership, Accounting, Order Processing, Committees, Events, Directories, Donations, Certification/Accreditation, Exhibitors, Advertisers, Subscriptions, Sponsorships, Sales Management, Service Management, Community Hub Member Portal.

Because Nimble AMS runs on Salesforce, there are **three distinct API surfaces** available for integration, each with different strengths.

---

## 2. Three Integration Paths

| Path | Entry Point | Best For | Auth |
|------|-------------|----------|------|
| **A. Salesforce REST API** | `/services/data/vXX.0/` | Direct SOQL queries, sObject CRUD on any standard or custom object | OAuth 2.0 (any flow) |
| **B. Nimble Fuse Integration API** | `/services/apexrest/NUINT/NUIntegrationService` | Batch inbound/outbound data sync with field mapping | OAuth 2.0 + Nimble auth key |
| **C. NAMS REST API Framework** | `/services/apexrest/nams/api/*` | Versioned, RESTful endpoints (currently LMS) | OAuth 2.0 |

All three paths require a Salesforce Connected App for OAuth authentication. Path A gives the most flexibility (any object, any query). Path B is Nimble's purpose-built sync API. Path C is the newest framework with proper REST semantics.

---

## 3. Path A: Salesforce REST API (Standard)

This is the standard Salesforce platform API. Because Nimble AMS objects are Salesforce custom objects (prefixed with `NU__`), they are fully accessible through the standard REST API.

### Base URL Pattern

```
https://{instance}.salesforce.com/services/data/v{version}/
```

Current API version: v66.0 (Spring '26). The instance URL is returned during OAuth token exchange.

### Key Endpoints

| Operation | Method | Endpoint | Notes |
|-----------|--------|----------|-------|
| **List objects** | GET | `/services/data/v66.0/sobjects/` | All standard + custom objects |
| **Describe object** | GET | `/services/data/v66.0/sobjects/{Object}/describe` | Full metadata: fields, picklists, relationships |
| **Create record** | POST | `/services/data/v66.0/sobjects/{Object}/` | Returns 201 + record ID |
| **Read record** | GET | `/services/data/v66.0/sobjects/{Object}/{id}` | Returns 200 + JSON |
| **Update record** | PATCH | `/services/data/v66.0/sobjects/{Object}/{id}` | Returns 204 |
| **Delete record** | DELETE | `/services/data/v66.0/sobjects/{Object}/{id}` | Returns 204 |
| **SOQL query** | GET | `/services/data/v66.0/query/?q={SOQL}` | URL-encoded SOQL |
| **SOSL search** | GET | `/services/data/v66.0/search/?q={SOSL}` | Full-text search |
| **Composite batch** | POST | `/services/data/v66.0/composite/batch` | Up to 25 sub-requests |
| **sObject Collections** | POST | `/services/data/v66.0/composite/sobjects` | Create/update up to 200 records |
| **Check limits** | GET | `/services/data/v66.0/limits` | Current API usage |

### SOQL Query Examples (Nimble AMS objects)

```sql
-- Get all person accounts (individual members)
SELECT Id, FirstName, LastName, PersonEmail, NU__MemberType__c, NU__Member__c
FROM Account WHERE IsPersonAccount = true

-- Get membership records
SELECT Id, NU__Account__c, NU__MembershipType__c, NU__StartDate__c, NU__EndDate__c
FROM NU__Membership__c WHERE NU__Status__c = 'Active'

-- Get products by type
SELECT Id, Name, NU__ShortName__c, RecordType.Name, NU__Status__c
FROM NU__Product__c WHERE RecordType.Name = 'Certification'
```

### Response Format

Standard JSON. Paginated queries return `totalSize`, `done`, `records[]`, and `nextRecordsUrl` for batches.

### Error Codes

- 400 Bad Request (malformed SOQL, invalid field)
- 401 Unauthorized (expired/missing token)
- 403 Forbidden (insufficient permissions, rate limit exceeded with `REQUEST_LIMIT_EXCEEDED`)
- 404 Not Found (invalid record ID)
- 409 Conflict (record lock)

---

## 4. Path B: Nimble Fuse Integration API

Nimble's purpose-built integration API for batch data sync. Uses a single POST endpoint with JSON payloads, configured through admin-created Integration Settings.

### Endpoint

**Authenticated (via Salesforce):**
```
POST https://{instance}.salesforce.com/services/apexrest/NUINT/NUIntegrationService
```

**Non-authenticated (via Community Hub):**
```
POST https://{CommunityHubURL}/services/apexrest/NUINT/NUIntegrationService
```

### Inbound (External -> Nimble) Request

```json
{
  "Name": "InboundSettingName",
  "Authentication Key": "your-256-bit-key",
  "Inbound Records": [
    {
      "ExternalField1": "value1",
      "ExternalField2": "value2"
    }
  ]
}
```

### Inbound Response

```json
{
  "Records": null,
  "RecordCount": 2,
  "Message": null,
  "InboundResults": [
    {
      "SalesforceId": "001...",
      "ExternalField1": "value1",
      "Error": null
    }
  ]
}
```

### Outbound (Nimble -> External) Request

```json
{
  "Name": "OutboundSettingName",
  "Authentication Key": "your-256-bit-key",
  "Parameter": {
    "param1": "value1"
  }
}
```

### Outbound Response

```json
{
  "Records": [ { "field1": "value1" } ],
  "RecordCount": 1,
  "Message": "",
  "InboundResults": null
}
```

### Configuration (Admin-Side)

Each Integration Setting requires:
- **Record Type:** Inbound Data or Outbound Data
- **Name:** API-facing identifier
- **Authentication Key:** 256-bit WEP key recommended
- **Sharing Mode:** "With Sharing" (respects user permissions) or "Without Sharing"
- **Inbound Object Name:** API name of the target Salesforce object
- **Inbound Batch Size:** Max records per call (max 10,000; recommended 5,000)
- **Inbound Salesforce External Id Field:** For upsert matching
- **Class:** Optional custom Apex class implementing `IIntegrationInboundDataProcessor`

Each field mapping is a child Integration Inbound Setting:
- **Integration Field Name:** External app's JSON key
- **Salesforce Field Name:** Nimble AMS API field name
- **Salesforce Lookup External Field Name:** For lookup/master-detail relationships

### Testing

- **Authenticated:** Workbench REST Explorer (requires Salesforce login)
- **Non-authenticated:** Postman or similar

---

## 5. Path C: NAMS REST API Framework

The newest API surface. Uses a second-generation package namespace `nams` with a structured REST routing framework.

### Entry Point

```
/services/apexrest/nams/api/{endpoint}/{version}/{resource}
```

### Currently Available Endpoints

**LMS API** (Learning Management System integration):
- `GET /nams/api/lms/v1/products` -- all LMS-eligible products
- `GET /nams/api/lms/v1/products/{productId}` -- single product
- `GET /nams/api/lms/v1/products/{productId}?expand=purchases` -- product with purchases
- `GET /nams/api/lms/v1/purchases` -- all purchases
- `GET /nams/api/lms/v1/purchases?customerId={accountId}` -- purchases by customer
- `GET /nams/api/lms/v1/purchases?lastUpdated={datetime}` -- purchases since date
- `POST /nams/api/lms/v1/purchases/{purchaseId}` -- sync purchase status back

### LMS Product Response Example

```json
{
  "productType": "On-Demand",
  "name": "Nimble Data Fundamentals",
  "id": "a1Z0R000002KBLPUA4",
  "description": "Course description text",
  "custom": {
    "NU__UnitPrice__c": 19.99,
    "NU__ShortName__c": "DEMAND"
  }
}
```

### LMS Purchase Response Example

```json
{
  "syncStatus": "Success",
  "status": "Active",
  "product": {
    "productType": "On-Demand",
    "name": "Course Name",
    "id": "a1Z0R000002KBLLUA4"
  },
  "id": "a1J0R000001qKOcUAM",
  "externalId": null,
  "customerId": "0011900001EJGj3AAH",
  "completionStatus": "In Progress"
}
```

### Custom Fields via Field Sets

Both GET and POST endpoints support custom fields through a `custom` object key, configured via Field Sets in the NAMS Setup app.

### Framework Architecture

The NAMS REST framework uses:
- **RestEndpoint:** Custom Metadata Type records (`nams__RestEndpoint__mdt`) defining route-to-class mapping
- **RestRoute:** Base class for handling HTTP verbs (`doGet`, `doPost`, `doDelete`, `doPut`, `doPatch`)
- **RestRouteContext:** Request/response context wrapper
- **Versioned routing:** `/endpoint/v1/`, `/endpoint/v2/` pattern
- **Resource expansion:** `?expand=` parameter for nested data in single calls

This is relevant because if NAHQ has an Oasis LMS integration through Nimble, the LMS API may already carry course/completion data we need.

---

## 6. Authentication and Connected Apps

All API access requires a **Salesforce Connected App** configured in the NAHQ Salesforce org.

### OAuth 2.0 Flows

| Flow | Use Case | Tokens | User Interaction |
|------|----------|--------|------------------|
| **JWT Bearer** | Server-to-server (recommended for Accelerate) | Access only (no refresh) | None |
| **Client Credentials** | Server-to-server (simpler, less secure) | Access only | None |
| **Web Server (Authorization Code)** | Web apps with user context | Access + Refresh | Login redirect |
| **Username-Password** | Legacy/testing only | Access + Refresh | None (creds in request) |

### JWT Bearer Flow (Recommended for Accelerate)

1. **Create Connected App** in Salesforce Setup
   - Enable OAuth settings
   - Add scopes: `api`, `refresh_token, offline_access`
   - Upload X.509 certificate (public key)
   - Set "Permitted Users" to "Admin approved users are pre-authorized"
   - Pre-authorize the integration user's profile

2. **Build JWT assertion** (in Spring Boot)
   - Header: `{"alg": "RS256"}`
   - Payload: `iss` (client_id), `sub` (username), `aud` (login URL), `exp` (expiry)
   - Sign with private key

3. **Exchange for access token**
   ```
   POST https://login.salesforce.com/services/oauth2/token
   Content-Type: application/x-www-form-urlencoded

   grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer
   &assertion={signed_jwt}
   ```

4. **Response includes:**
   ```json
   {
     "access_token": "00D...",
     "instance_url": "https://nahq.my.salesforce.com",
     "id": "https://login.salesforce.com/id/00D.../005...",
     "token_type": "Bearer",
     "scope": "api"
   }
   ```

5. **Use in API calls:**
   ```
   Authorization: Bearer {access_token}
   ```

### Token Endpoints

- **Production:** `https://login.salesforce.com/services/oauth2/token`
- **Sandbox:** `https://test.salesforce.com/services/oauth2/token`
- **Custom domain:** `https://{domain}.my.salesforce.com/services/oauth2/token`

### Key Consideration

No refresh token is returned with JWT Bearer flow. When the access token expires, generate a new JWT and exchange again. Token lifetime is typically 2 hours but configurable per Connected App.

---

## 7. Nimble AMS Data Model

### Namespaces

| Package | Namespace | Objects Prefixed As |
|---------|-----------|---------------------|
| Nimble AMS (core) | `NU` | `NU__ObjectName__c`, `NU__FieldName__c` |
| Community Hub | `NC` | `NC__ObjectName__c` |
| NAMS (2GP suite) | `nams` | `nams__ObjectName__c` |
| Nimble Fuse (integration) | `NUINT` | Apex REST endpoint namespace |

### Core Objects (NU Namespace)

**Accounts (Salesforce standard + Nimble fields):**
- Uses **Person Accounts** model (Account + Contact merged for B2C individuals)
- Business Accounts for organizational members (B2B)
- Key Nimble fields on Account:
  - `NU__MemberType__c` -- membership classification
  - `NU__Member__c` -- boolean, active member flag
  - `NU__Lapsed__c` -- boolean, lapsed member flag
  - `NU__JoinOn__c` -- membership join date
  - `NU__MemberThru__c` -- membership expiry date
  - `NU__LapsedOn__c` -- lapse date
  - `NU__AccountBalance__c` -- financial balance (updated daily by scheduled job)
  - `NU__CreditBalance__c` -- credit balance
  - `NU__Degrees__pc` -- person account field for degrees

**Entity:** Organizational unit that owns products and defines currency. Products must link to an Entity, and currency must match.

**Product (`NU__Product__c`):**
- Record Types define product category: Membership, Event, Registration, Certification, Donation, Merchandise, Subscription, Sponsorship, Advertisement, Exhibit, Cancellation Fee, Coupon
- Key fields: Name, Short Name, Status (Active/Inactive), List Price, Display Order, Entity (lookup), Currency, Revenue GL Account, Tax Code
- Membership products: Recurring Eligible, Recurring Frequency
- Self Service Enabled flag controls Community Hub visibility
- 11 base product types

**Membership (`NU__Membership__c`):** Term-based membership records linking Account to Membership Type, with start/end dates and status.

**Order / Order Item:** Order processing with configurable Order Item Configurations that define behavior per product type. Entity Order Items control which order types are available per entity.

**Affiliation:** Relationships between accounts (individual-to-organization, organization-to-organization).

**Chapter:** Organizational chapters/sections with hierarchy support.

### Product Types Supported

| Product Type | Record Type |
|-------------|-------------|
| Memberships | Membership |
| Events | Event |
| Registrations | Registration |
| Certifications | Certification |
| Donations | Donation |
| Merchandise | Merchandise |
| Subscriptions | Subscription |
| Sponsorships | Sponsorship |
| Advertisements | Advertisement |
| Exhibits | Exhibit |
| Cancellation Fees | Cancellation Fee |
| Coupons | Coupon |

### Object Design Conventions

Nimble AMS follows strict naming conventions:
- **Labels:** Title case (e.g., "Committee Membership")
- **Object API names:** PascalCase (e.g., `CommitteeMembership`)
- **Autonumber format:** `{Abbreviation} {0000000}` (e.g., "SL {0000001}")
- All objects have: Reports, Activities, Field History, Chatter Groups, Sharing, Bulk API Access, Streaming API Access, Search enabled

---

## 8. Programs (Certification/Accreditation)

This is the most relevant Nimble AMS feature for NAHQ Accelerate, as NAHQ's core business is healthcare quality competency certification.

**Nimble Programs** is a separate installable package that provides:

### Key Objects

| Object | Purpose |
|--------|---------|
| **Program** | A term-based certification/accreditation program purchased through the order wizard |
| **Program Type** | Defines the structure, requirements, and management rules for completion |
| **Milestone** | Auto-generated after program purchase; represents progress checkpoints |
| **Milestone Type** | Defines requirements for each milestone |
| **Component** | Achievements candidates collect (CE units, exams, documents, experience) |
| **Component Type** | Tags/categorizes components |
| **Milestone Component Link (MCL)** | Connects components to milestones; auto-created on enrollment |
| **Milestone Type Component Type Link (MTCTL)** | Defines which component types satisfy which milestones |
| **Program Type Product Link** | Connects program products to stages (optional/required/primary) |

### How It Works

1. A **Program Type** defines the certification structure (e.g., "CPHQ Certification")
2. The Program Type has **Milestone Types** (e.g., "Complete Assessment", "Earn CE Credits", "Pass Exam")
3. Each Milestone Type has **MTCTL** records defining accepted Component Types
4. A member purchases the program, creating a **Program** record
5. **Milestones** are auto-generated based on Milestone Types
6. As the member collects **Components**, **MCL** records link them to milestones
7. When all milestones are fulfilled, the program is complete (certification granted)

### Relevance to NAHQ Accelerate

NAHQ's competency assessment (the Professional Assessment) and upskill plans map conceptually to Nimble's Programs model:
- **Program Type** = Accelerate assessment cycle
- **Milestones** = competency benchmarks or assessment completion gates
- **Components** = completed courses, CE credits, assessment scores
- **Component Types** = competency domains

Whether NAHQ actually uses Nimble Programs for Accelerate tracking (vs. managing it entirely in our app) is an open question for Tim.

---

## 9. Rate Limits

### Daily API Request Limits

**Formula:** Base limit + (per-user allocation x number of user licenses)

| Edition | Base | Per User | Example (50 users) |
|---------|------|----------|---------------------|
| Developer | 15,000 | -- | 15,000 |
| Enterprise | 100,000 | 1,000 | 150,000 |
| Unlimited | 100,000 | 1,000 | 150,000 |
| Performance | 100,000 | 1,000 | 150,000 |

Limits are on a **rolling 24-hour basis**, not calendar day.

Additional API calls can be purchased in increments of 200-10,000 per 24-hour period.

### Other Limits

| Constraint | Limit |
|-----------|-------|
| Concurrent API requests | Edition-dependent (typically 5-25) |
| Request payload size | ~6 MB |
| Response payload size | ~15 MB |
| Callout timeout | 10 seconds (extendable to 120) |
| Composite batch sub-requests | 25 per call |
| sObject Collections | 200 records per call |
| Nimble Fuse inbound batch | 10,000 max (5,000 recommended) |

### Checking Current Usage

```
GET /services/data/v66.0/limits
Authorization: Bearer {access_token}
```

Returns current allocations and remaining capacity for all limit types.

### Rate Limit Error

```
HTTP 403 Forbidden
{"errorCode": "REQUEST_LIMIT_EXCEEDED"}
```

---

## 10. Nimble Apex API (Extensibility)

Nimble AMS provides a public Apex API for developers building on the platform. Documentation is at https://nimbleuser.github.io/nams-api-docs/ (GitHub: NimbleUser/nams-api-docs).

### API Architecture

All APIs follow a consistent layered pattern:
- **Entry-point:** `{Domain}Api` class with versioned accessor (e.g., `ProductsApi.v1`)
- **Factory:** Creates model objects (`ProductsApi.v1.factory().createNew()`)
- **Retriever:** Queries database, returns model objects
- **Service:** Business operations
- **Model:** In-memory SObject representations

Dependencies are injected via the Force-di library, allowing any layer to be overridden.

### Available APIs (NAMS namespace)

| API | Purpose |
|-----|---------|
| `AccountsApi` | Person and business account CRUD (AccountBase, PersonBase models) |
| `AffiliationsApi` | Account-to-account relationships |
| `ChaptersApi` | Organizational chapters/hierarchy |
| `EvaluationsApi` | Criteria-based evaluation framework |
| `TriggerStepApi` | Trigger automation framework |
| `UiApi` | UI record API for component rendering |

### Available APIs (NC namespace - Community Hub)

Extensive global APIs for the member portal including: CartItemService, CartCloneService, MembershipService, PaymentService, OrderService, DataSource framework, DupeService, FileUploadService, ConfigurationService, and many UI component controllers.

### Core Frameworks

| Framework | Purpose |
|-----------|---------|
| **Evaluations** | Rule-based criteria evaluation |
| **Fields Providers** | Dynamic field resolution |
| **Persistence** | Database abstraction layer |
| **REST** | REST endpoint framework (see Path C above) |
| **Triggers** | Declarative trigger management |
| **Logger** | Structured logging |

### Cookbook Recipes Available

- Order API usage
- Deferred Revenue extension
- Cart Pricing framework
- Coupon Validation
- SOQL Data Source
- Flow as Data Source
- Dynamic Pages
- Payment Options
- Custom Bundle Components
- File Framework
- Access Control Settings

---

## 11. Integration Approach for NAHQ Accelerate

### Recommended: Path A (Salesforce REST API) for MVP

For the Accelerate integration, the Salesforce REST API (Path A) is the most pragmatic choice:

1. **No Nimble admin configuration required** -- we query objects directly via SOQL
2. **Full access to all 157 custom objects** -- we can discover the exact schema with `/describe`
3. **SOQL gives us precise control** -- join, filter, aggregate without middleware
4. **Standard Spring Boot integration** -- use `spring-boot-starter-oauth2-client` or a lightweight HTTP client
5. **Well-documented, widely used** -- massive ecosystem of examples and libraries

### Data We Need from Nimble

| Data | Nimble Source | Accelerate Destination | Sync Pattern |
|------|-------------|----------------------|--------------|
| Member profiles | Account (Person Account) | `individual`, `party_role` | Batch import or on-demand query |
| Organization info | Account (Business) | `organization`, `party_relationship` | Batch import |
| Membership status | `NU__Membership__c` | `party_role` attributes | Periodic sync |
| Certification programs | Program / Program Type | `competency_framework` reference | One-time import + periodic |
| Assessment history | (TBD -- may be custom object) | `assessment_result` | TBD |
| Course catalog | Product (LMS type) or via NAMS LMS API | `lms_course` | Periodic sync |

### Implementation Sketch (Spring Boot)

```java
@Service
public class SalesforceClient {
    private final WebClient webClient;

    // JWT Bearer token exchange
    public String getAccessToken() {
        String jwt = buildJwt(clientId, username, privateKey);
        // POST to /services/oauth2/token with grant_type=jwt-bearer
    }

    // SOQL query
    public SalesforceQueryResult query(String soql) {
        return webClient.get()
            .uri(instanceUrl + "/services/data/v66.0/query/?q=" + encode(soql))
            .header("Authorization", "Bearer " + accessToken)
            .retrieve()
            .bodyToMono(SalesforceQueryResult.class)
            .block();
    }

    // Describe object (discover fields)
    public SObjectDescribe describe(String objectName) {
        return webClient.get()
            .uri(instanceUrl + "/services/data/v66.0/sobjects/" + objectName + "/describe")
            .header("Authorization", "Bearer " + accessToken)
            .retrieve()
            .bodyToMono(SObjectDescribe.class)
            .block();
    }
}
```

### Discovery Phase (Before Building)

When we get Nimble sandbox access, the first step is schema discovery:

```sql
-- List all NU-namespaced objects
-- Use: GET /services/data/v66.0/sobjects/ and filter by NU__ prefix

-- Describe key objects to find actual field names
-- GET /services/data/v66.0/sobjects/NU__Membership__c/describe
-- GET /services/data/v66.0/sobjects/Account/describe
-- GET /services/data/v66.0/sobjects/NU__Product__c/describe

-- Find NAHQ's specific custom fields (may have NAHQ-specific customizations)
-- Look for fields without NU__ prefix (org-specific custom fields)
```

---

## 12. Open Questions for Tim/NAHQ

### Access & Credentials
1. Can we get a Connected App created in the NAHQ Salesforce sandbox? (Need: client_id, certificate upload, integration user)
2. What Salesforce edition does NAHQ use? (Affects rate limits and available features)
3. Is there a dedicated sandbox/dev org for integration testing?

### Data Model
4. Does NAHQ use Nimble Programs for certification tracking? Or is certification managed through custom objects?
5. What custom fields has NAHQ added beyond the standard NU objects? (Org-specific customizations)
6. How are competency domains represented in Nimble? (Custom object? Picklist? Product category?)
7. Where do Professional Assessment results live? (In Nimble? In Qualtrics only? In a custom object?)

### Integration Pattern
8. For MVP, is a one-time batch import of member/org data acceptable? Or does NAHQ need real-time sync?
9. Does NAHQ already have any Integration Settings (Nimble Fuse) configured for other systems?
10. Is the NAMS LMS API active? (Would indicate Oasis integration goes through Nimble)
11. Who is the Nimble admin at NAHQ? (May not be Tim -- could be a membership ops person)

### Scope
12. How many member records are we talking about? (100s? 1000s? Affects sync strategy)
13. Does each Accelerate cohort map to a Nimble entity, campaign, or custom object?
14. Should Accelerate write assessment results back to Nimble? Or is Nimble read-only for us?

---

## 13. Sources

### Nimble AMS Documentation
- [Nimble AMS Help Center](https://help.nimbleams.com/)
- [Nimble AMS Developer Documentation](https://nimbleuser.github.io/nams-api-docs/) (GitHub: NimbleUser/nams-api-docs)
- [Nimble AMS API Overview](https://help.nimbleams.com/help/live/api)
- [Call the Integration API (Nimble Fuse)](https://help.nimbleams.com/call-the-integration-api-144801993.html)
- [Create Inbound Integration Setting](https://help.nimbleams.com/help/live/create-inbound-integration-setting)
- [Object Design Guidelines](https://help.nimbleams.com/object-design-guidelines-81526962.html)
- [Manage Membership Products](https://help.nimbleams.com/help/live/manage-membership-products)
- [Product Configuration](https://help.nimbleams.com/help/live/product-configuration)
- [Programs (Certification/Accreditation)](https://help.nimbleams.com/programs-6177799.html)
- [Accounts (Person Accounts)](https://help.nimbleams.com/help/live/accounts)
- [Nimble AMS Apex Global API](https://help.nimbleams.com/help/live/nimble-ams-apex-global-api)
- [Nimble AMS on Salesforce AppExchange](https://appexchange.salesforce.com/appxListingDetail?listingId=a0N30000007qkbREAQ)

### Salesforce Platform Documentation
- [Salesforce REST API Developer Guide (PDF, v66.0 Spring '26)](https://resources.docs.salesforce.com/latest/latest/en-us/sfdc/pdf/api_rest.pdf)
- [Salesforce REST API Comprehensive Guide](https://www.dreaminforce.com/salesforce-integration-using-rest-api-comprehensive-guide/)
- [OAuth 2.0 JWT Bearer Flow](https://help.salesforce.com/s/articleView?language=en_US&id=sf.remoteaccess_oauth_jwt_flow.htm&type=5)
- [API Request Limits and Allocations](https://developer.salesforce.com/docs/atlas.en-us.salesforce_app_limits_cheatsheet.meta/salesforce_app_limits_cheatsheet/salesforce_app_limits_platform_api.htm)
- [API Limits and Monitoring Blog Post](https://developer.salesforce.com/blogs/2024/11/api-limits-and-monitoring-your-api-usage)
- [REST API Rate Limits Guide (Coefficient)](https://coefficient.io/salesforce-api/salesforce-api-rate-limits)

### Nimble AMS GitHub
- [NimbleUser GitHub Organization](https://github.com/NimbleUser)
- [nams-api-docs Repository](https://github.com/NimbleUser/nams-api-docs)
- [Nimble AMS Apex Style Guide](https://nimbleuser.github.io/apex-style-guide/)
