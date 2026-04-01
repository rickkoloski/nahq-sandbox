# Qualtrics API Research — NAHQ Accelerate Integration

**Date:** March 31, 2026
**Purpose:** Technical research on the Qualtrics API for integrating Professional Assessment (PA) results into Accelerate.
**Context:** The PA is a 45-minute self-assessment hosted in Qualtrics. Scored results (per competency, 0-3 scale) must flow into Accelerate for dashboards.

---

## 1. API Overview

**API Version:** v3 (REST)
**Base URL Pattern:** `https://{datacenterId}.qualtrics.com/API/v3/{endpoint}`
**Protocol:** HTTPS only (TLS 1.2+)
**Response Format:** JSON
**Methods:** GET, POST, PUT, DELETE (PATCH not supported)

The datacenter ID is organization-specific (e.g., `ca1`, `iad1`, `sjc1`). It appears in Account Settings > Qualtrics IDs. Getting the correct datacenter ID is critical — some endpoints will silently fail with the wrong one.

---

## 2. Authentication

### Option A: API Token (simpler, recommended for MVP)

- Each user generates a personal API token via Account Settings > Qualtrics IDs > API
- Pass as HTTP header: `X-API-TOKEN: {token}`
- Generating a new token invalidates the previous one
- Token is tied to a single user account

```bash
curl -H "X-API-TOKEN: abc123def456" \
  "https://{dcid}.qualtrics.com/API/v3/surveys"
```

### Option B: OAuth 2.0 Client Credentials (recommended for production)

- Create via Account Settings > Qualtrics IDs > OAuth Client Manager
- Grant types: Authorization Code (interactive) or Client Credentials (server-to-server)
- Token endpoint: `https://{datacenterId}.qualtrics.com/oauth2/token`
- Client Credentials flow is appropriate for backend automation (our use case)
- **Critical:** Client Secret is shown only once at creation — store it immediately
- Supports token refresh via `grant_type: refresh_token`

```
POST https://{dcid}.qualtrics.com/oauth2/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&client_id={id}&client_secret={secret}
```

**Recommendation for NAHQ:** Start with API Token for prototype/sandbox. Move to OAuth Client Credentials for production (server-to-server, no user session dependency).

---

## 3. Key API Entities

| Entity | Description | Relevance to NAHQ |
|--------|-------------|-------------------|
| **Surveys** | Survey definitions, questions, flow | Get PA survey structure, question-to-competency mapping |
| **Responses** | Individual survey submissions | Core data — PA scores per participant |
| **Response Exports** | Bulk export of response data | Batch import of assessment results |
| **Distributions** | Survey delivery (email, links, SMS) | May not need — NAHQ manages distribution |
| **Contacts / Directories** | Recipient lists (XM Directory) | Could map to our Party model |
| **Webhooks / Event Subscriptions** | Real-time notifications | Notify Accelerate when a PA is completed |

---

## 4. Key Endpoints for Our Use Case

### 4a. List Surveys

```
GET /API/v3/surveys
```

Response:
```json
{
  "result": {
    "elements": [
      {
        "id": "SV_abcdefghijklmno",
        "name": "NAHQ Professional Assessment 2026",
        "ownerId": "UR_1234567890abcdef",
        "lastModified": "2026-01-15T10:30:00Z",
        "isActive": true
      }
    ]
  },
  "meta": { "httpStatus": "200 - OK" }
}
```

### 4b. Get Survey Definition (question structure)

```
GET /API/v3/surveys/{surveyId}
```

Returns full survey structure including questions, blocks, and flow. Useful for programmatic question-to-competency mapping.

### 4c. Get Single Response (by Response ID)

```
GET /API/v3/surveys/{surveyId}/responses/{responseId}
```

Returns one response with all question answers. Use after receiving a webhook notification.

### 4d. Response Export (bulk — 3-step async workflow)

This is the primary mechanism for retrieving multiple responses.

**Step 1: Create Export**
```
POST /API/v3/surveys/{surveyId}/export-responses
Content-Type: application/json

{
  "format": "json",
  "startDate": "2026-03-01T00:00:00Z",
  "endDate": "2026-03-31T23:59:59Z",
  "includedQuestionIds": ["QID1", "QID2", "QID3"]
}
```

Returns: `{ "result": { "progressId": "ES_abc123..." } }`

Supported formats: `json`, `ndjson`, `csv`, `tsv`, `spss`, `xml`

Optional filters: `startDate`, `endDate`, `limit`, `includedQuestionIds`

**Step 2: Check Export Progress**
```
GET /API/v3/surveys/{surveyId}/export-responses/{progressId}
```

Returns: `{ "result": { "percentComplete": 100, "fileId": "..." } }`

Poll until `percentComplete` reaches 100.

**Step 3: Download Export File**
```
GET /API/v3/surveys/{surveyId}/export-responses/{fileId}/file
```

Returns a compressed (ZIP) file containing the response data in the requested format.

**Important:** The datacenter ID in the URL must be correct for export endpoints — other endpoints may tolerate a wrong datacenter, but exports will not.

### 4e. Create Webhook Subscription

```
POST /API/v3/eventsubscriptions
X-API-TOKEN: {token}
Content-Type: application/json

{
  "topics": "surveyengine.completedResponse.{surveyId}",
  "publicationUrl": "https://accelerate.nahq.org/api/webhooks/qualtrics",
  "encrypt": true
}
```

Alternative topic format: `surveyresponse.completed`

---

## 5. Webhook / Event Subscription Details

### Event Types

| Topic | Trigger |
|-------|---------|
| `surveyengine.completedResponse.{SurveyID}` | Specific survey completed |
| `surveyresponse.completed` | Any survey response completed |
| `controlpanel.activateSurvey` | Survey activated |
| `controlpanel.deactivateSurvey` | Survey deactivated |

### Webhook Payload (on completion)

```json
{
  "topic": "surveyengine.completedResponse.SV_abc123",
  "Status": "Complete",
  "SurveyID": "SV_abc123",
  "ResponseID": "R_xyz789",
  "RecipientID": "MLRP_abc...",
  "CompletedDate": "2026-03-31T14:22:00Z",
  "BrandID": "nahq"
}
```

### Webhook Security (HMAC-SHA256)

- When `encrypt: true` is set on subscription, Qualtrics signs payloads
- Verify incoming requests using HMAC-SHA256 against the webhook secret
- Always validate signature before processing

### Recommended Integration Pattern

1. Register webhook for `surveyengine.completedResponse.{PA_SurveyID}`
2. On webhook receipt, extract `ResponseID` and `SurveyID`
3. Call `GET /API/v3/surveys/{surveyId}/responses/{responseId}` to fetch full response data
4. Map question answers to competency scores using the Survey Question Mapping
5. Store scored results in Accelerate's assessment tables

---

## 6. JSON Events (Alternative to Webhooks)

Qualtrics also supports "JSON Events" — external HTTP triggers that start workflows within Qualtrics.

- Endpoint: unique URL generated per workflow
- Auth: `X-API-TOKEN` header or HTTP Basic Auth
- Payload parsing: JSONPath syntax
- Limit: 3,000 requests/minute, 100 KB max payload
- Use case: Could trigger survey distribution from Accelerate (e.g., when a cohort starts)

This is the reverse direction — Accelerate calling into Qualtrics to trigger actions, not receiving results.

---

## 7. Rate Limits

| Scope | Limit | Notes |
|-------|-------|-------|
| **Brand-level default** | 3,000 requests/minute | Shared across all users in the organization |
| **OAuth-authenticated** | 350 requests/hour per user | More restrictive per-user limit |
| **JSON Events inbound** | 3,000 requests/minute | For external triggers into Qualtrics |
| **Error response** | HTTP 400, error: `rate_limit_reached` | Check response headers for limit details |

Rate limits vary by pricing tier (Core, Professional, Enterprise). NAHQ's specific limits depend on their Qualtrics license.

**Mitigation strategies:**
- Exponential backoff on 400/rate_limit_reached
- Batch requests where possible
- Use response exports (async) instead of individual response fetches for bulk operations
- Spread requests over time

---

## 8. SDKs and Libraries

### Official
- **Postman Collection:** Qualtrics publishes public API collections in the Postman Public Workspace — useful for testing
- **Code examples:** Official docs include Python and Java snippets
- **No official SDK** in the traditional sense (no `npm install qualtrics-sdk` from Qualtrics)

### Community / Third-Party

| Library | Language | Notes |
|---------|----------|-------|
| `qualtrics-sdk-node` | Node.js | npm package, community-maintained |
| `qualtrics-api` | Node.js | npm package, community-maintained |
| `QualtricsAPI` | Python (PyPI) | Lightweight wrapper, not affiliated with Qualtrics |
| `qualtRics` | R | CRAN package for R users |

### Recommendation for NAHQ (Java/Spring Boot)

No official Java SDK exists. Use Spring's `RestTemplate` or `WebClient` directly against the REST API. The API is straightforward REST/JSON — a thin service class wrapping the key endpoints is sufficient:

```java
@Service
public class QualtricsService {
    // GET /surveys/{id}/responses/{responseId}
    // POST /surveys/{id}/export-responses
    // GET /surveys/{id}/export-responses/{progressId}
    // GET /surveys/{id}/export-responses/{fileId}/file
    // POST /eventsubscriptions (webhook registration)
}
```

---

## 9. Response Data Structure

### Individual Response Fields (JSON export)

Each response record contains:

| Field | Description | Example |
|-------|-------------|---------|
| `responseId` | Unique response identifier | `R_3abc123xyz` |
| `values` | Question answers (keyed by QID) | `{ "QID1": 2, "QID2": 3 }` |
| `labels` | Human-readable answer labels | `{ "QID1": "Sometimes" }` |
| `displayedFields` | Questions shown to respondent | `["QID1", "QID2"]` |
| `displayedValues` | Values for displayed questions | `{ "QID1": 2 }` |
| `startDate` | Response start timestamp | `2026-03-15T09:00:00Z` |
| `endDate` | Response end timestamp | `2026-03-15T09:45:00Z` |
| `status` | Completion status | `"Complete"` |
| `ipAddress` | Respondent IP | `192.168.1.1` |
| `duration` | Time spent (seconds) | `2700` |
| `recipientEmail` | Contact email (if distributed) | `nurse@hospital.org` |
| `recipientFirstName` | Contact first name | `Jane` |
| `recipientLastName` | Contact last name | `Smith` |
| `externalDataReference` | External ID (our participant ID) | `IND_00042` |
| `embeddedData` | Custom metadata fields | `{ "cohortId": "COH_001" }` |

### Scoring for NAHQ

The PA maps questions to competencies. The raw Qualtrics response gives question-level answers; our code must:

1. Fetch the response (question answers as QID → value)
2. Apply the Survey Question Mapping (QID → competency)
3. Aggregate to competency scores (0-3 scale)
4. Store as `assessment_result` records in Accelerate

This mapping is documented in "Survey Question Mapping_2025.xlsx" (NAHQ-provided).

---

## 10. Integration Architecture for NAHQ Accelerate

### Phase 1: Demo/Prototype (current)
- Synthetic assessment data generated by seed service
- No Qualtrics connection needed
- Focus on dashboards and AI insights

### Phase 2: Manual Import
- NAHQ exports CSV/JSON from Qualtrics manually
- Accelerate provides an import endpoint: `POST /api/assessments/import`
- Maps Qualtrics response format to our assessment_result schema
- Low effort, no API credentials needed

### Phase 3: Automated Sync (production)
- Register webhook for PA survey completion events
- On webhook: fetch individual response via API
- Score and store automatically
- Support bulk backfill via response export workflow
- OAuth Client Credentials for server-to-server auth

### Phase 4: Full Integration
- Trigger PA distribution from Accelerate (when cohort launches)
- Track in-progress assessments
- Support re-assessment cycles
- Bi-directional sync with embeddedData for participant context

---

## 11. Prerequisites from NAHQ

Before implementing Qualtrics integration, we need from NAHQ/Tim:

1. **Qualtrics datacenter ID** — required for all API calls
2. **API access confirmation** — is API access enabled on NAHQ's Qualtrics license?
3. **PA Survey ID** — the `SV_` identifier for the Professional Assessment
4. **API token or OAuth credentials** — for sandbox/testing
5. **Survey Question Mapping file** — confirms QID-to-competency mapping (have xlsx, need to validate)
6. **Embedded data fields** — what metadata does NAHQ attach to each distribution?
7. **Current data flow** — how do results get from Qualtrics to reports today?

---

## 12. Sources

- [Qualtrics API Reference](https://api.qualtrics.com/)
- [Getting Started with the Qualtrics API](https://www.qualtrics.com/support/integrations/api-integration/overview/)
- [Common API Use Cases](https://www.qualtrics.com/support/integrations/api-integration/common-api-use-cases/)
- [JSON Events Documentation](https://www.qualtrics.com/support/survey-platform/actions-module/json-events/)
- [Qualtrics API Guide (Zuplo)](https://zuplo.com/learning-center/qualtrics-api)
- [Qualtrics API Essentials (Rollout)](https://rollout.com/integration-guides/qualtrics/api-essentials)
- [Qualtrics Webhook Guide (Rollout)](https://rollout.com/integration-guides/qualtrics/quick-guide-to-implementing-webhooks-in-qualtrics)
- [Qualtrics OAuth Flow Guide (Rollout)](https://rollout.com/integration-guides/qualtrics/how-to-build-a-public-qualtrics-integration-building-the-auth-flow)
- [Qualtrics Survey API (Postman)](https://www.postman.com/qualtrics-public-apis/qualtrics-public-workspace/collection/bcd3rug/qualtrics-survey-api)
- [QualtricsAPI Python Package (PyPI)](https://pypi.org/project/QualtricsAPI/)
- [qualtrics-sdk-node (npm)](https://www.npmjs.com/package/qualtrics-sdk-node/v/3.7.0)
- [Enhanced Survey Response Monitoring (Urban Institute)](https://urban-institute.medium.com/enhanced-survey-response-monitoring-with-the-qualtrics-api-92c3dcf126d2)
- [Qualtrics Community — Webhook + Event Subscriptions](https://community.qualtrics.com/qualtrics-api-13/how-to-combine-webhooks-and-event-subscription-19116)
- [Qualtrics Community — API Rate Limits](https://community.qualtrics.com/qualtrics-api-13/request-api-limits-survey-responses-7171)
