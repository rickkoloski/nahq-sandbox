# Microsoft Entra ID Integration for NAHQ Accelerate

Research summary for admin authentication and hospital executive SSO.

**Date:** 2026-03-31
**Status:** Research / Reference

---

## 1. Overview and Key Concepts

**Microsoft Entra ID** (formerly Azure AD) is Microsoft's cloud-based identity and access management service. It implements the OpenID Connect (OIDC) protocol on top of OAuth 2.0, making it suitable for both authentication (who is the user?) and authorization (what can they access?).

### Core Concepts

| Concept | Description |
|---------|-------------|
| **Tenant** | A dedicated instance of Entra ID representing an organization. Identified by a Directory (Tenant) ID (GUID) or domain (e.g., `contoso.onmicrosoft.com`). Each hospital would have its own tenant. |
| **App Registration** | The identity configuration for your application in Entra ID. Creates a trust relationship (unidirectional -- app trusts the platform). |
| **Application (Client) ID** | A GUID that uniquely identifies your app registration. Used in all OAuth requests. |
| **Directory (Tenant) ID** | The GUID of the Entra tenant. Determines who can sign in. |
| **Client Secret / Certificate** | Credentials the app uses to prove its identity to the token endpoint. Certificates are preferred for production. |
| **Scopes** | Permissions the app requests. OIDC scopes: `openid`, `profile`, `email`, `offline_access`. Resource scopes: e.g., `https://graph.microsoft.com/User.Read`. |
| **Consent** | Users (or admins) must approve the permissions an app requests. Admin consent is required for app-level permissions. |

### Supported Account Types (Sign-In Audience)

| Setting | Description | NAHQ Relevance |
|---------|-------------|----------------|
| **Single tenant** | Only users from your Entra tenant | For EpicDX/NAHQ admin accounts only |
| **Multi-tenant (organizations)** | Users from any Entra tenant | For hospital executives logging in from their own tenants |
| **Multi-tenant + personal** | Orgs + personal Microsoft accounts | Not needed for NAHQ |
| **Personal only** | Consumer Microsoft accounts only | Not applicable |

**Recommendation for NAHQ:** Register as **multi-tenant (organizations)** to support both EpicDX admin login and hospital executive SSO from their own tenants.

---

## 2. Key Endpoints (v2.0)

All endpoints use the v2.0 Microsoft identity platform. Replace `{tenant}` with the tenant ID, `common`, `organizations`, or `consumers`.

| Endpoint | URL |
|----------|-----|
| **Discovery** | `https://login.microsoftonline.com/{tenant}/v2.0/.well-known/openid-configuration` |
| **Authorization** | `https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize` |
| **Token** | `https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token` |
| **UserInfo** | `https://graph.microsoft.com/oidc/userinfo` |
| **JWKS** | `https://login.microsoftonline.com/{tenant}/discovery/v2.0/keys` |
| **Logout** | `https://login.microsoftonline.com/{tenant}/oauth2/v2.0/logout` |
| **Admin Consent** | `https://login.microsoftonline.com/{tenant}/adminconsent` |

**Tenant values:**
- `common` -- any Entra or personal Microsoft account
- `organizations` -- any Entra work/school account (best for NAHQ multi-hospital SSO)
- `consumers` -- personal Microsoft accounts only
- `{tenant-id}` or `contoso.onmicrosoft.com` -- specific tenant only

---

## 3. OAuth 2.0 / OIDC Flows

### 3.1 Authorization Code Flow (Primary -- for web apps)

The recommended flow for server-side web applications. NAHQ should use this for both admin and executive login.

**Sequence:**
1. App redirects user to `/authorize` with `response_type=code`, `scope=openid profile email`, PKCE `code_challenge`
2. User authenticates at Microsoft sign-in page
3. Microsoft redirects back with an authorization `code`
4. App exchanges `code` for tokens at `/token` endpoint (with `client_secret` + `code_verifier`)
5. Receives `access_token`, `id_token`, and `refresh_token`

**Key Parameters for /authorize:**

| Parameter | Required | Value |
|-----------|----------|-------|
| `client_id` | Yes | Application (Client) ID |
| `response_type` | Yes | `code` (or `code id_token` for hybrid) |
| `redirect_uri` | Yes | Must match registered URI exactly |
| `scope` | Yes | `openid profile email offline_access` |
| `state` | Recommended | CSRF protection (random value) |
| `nonce` | Required for id_token | Token replay protection |
| `code_challenge` | Recommended | PKCE SHA256 hash of code_verifier |
| `code_challenge_method` | Recommended | `S256` |
| `prompt` | Optional | `login`, `consent`, `none`, `select_account` |
| `login_hint` | Optional | Pre-fill username |
| `domain_hint` | Optional | Skip email-based discovery for federated users |

**Key Parameters for /token (code redemption):**

| Parameter | Required | Value |
|-----------|----------|-------|
| `client_id` | Yes | Application (Client) ID |
| `grant_type` | Yes | `authorization_code` |
| `code` | Yes | The authorization code received |
| `redirect_uri` | Yes | Same as authorize request |
| `code_verifier` | Recommended | PKCE original random string |
| `client_secret` | Yes (web apps) | App registration secret |
| `scope` | Optional | Scopes for the token |

**Token Response:**
```json
{
    "access_token": "eyJ0eX...",
    "token_type": "Bearer",
    "expires_in": 3599,
    "scope": "openid profile email",
    "refresh_token": "AwABAAAA...",
    "id_token": "eyJ0eX..."
}
```

**PKCE (Proof Key for Code Exchange):** Recommended for all app types, required for SPAs. Prevents authorization code interception attacks. Generate a random `code_verifier`, hash it with SHA256 to create `code_challenge`, send challenge in authorize request, send verifier in token request.

### 3.2 Client Credentials Flow (for service-to-service / daemon)

Used when no user is present -- the app authenticates as itself. Relevant for NAHQ backend services calling Microsoft Graph to sync user data or validate tenant configurations.

**Sequence:**
1. App POSTs directly to `/token` with `grant_type=client_credentials`
2. Receives an `access_token` (no refresh token, no id_token)

**Key Parameters:**

| Parameter | Required | Value |
|-----------|----------|-------|
| `client_id` | Yes | Application (Client) ID |
| `scope` | Yes | `https://graph.microsoft.com/.default` (the `.default` suffix) |
| `client_secret` or `client_assertion` | Yes | Secret or certificate JWT |
| `grant_type` | Yes | `client_credentials` |

**Important:** Uses **application permissions** (not delegated). These require **admin consent** and grant broad access -- e.g., `User.Read.All` reads ALL users in the tenant. The `.default` scope means "all pre-consented permissions for this resource."

**Token Response:**
```json
{
    "token_type": "Bearer",
    "expires_in": 3599,
    "access_token": "eyJ0eX..."
}
```

**Authentication Options:**
1. **Shared secret** -- simple but less secure, must be rotated
2. **Certificate credential** -- asymmetric key, more secure for production
3. **Federated credential** -- JWT from external IdP (e.g., for cross-cloud scenarios)

### 3.3 Hybrid Flow (Authorization Code + ID Token)

Combines code flow with immediate ID token delivery. Useful for rendering a page before code redemption completes. Uses `response_type=code id_token`.

### 3.4 Refresh Token Flow

Access tokens expire in ~1 hour. Use refresh tokens to get new access tokens without re-authenticating. POST to `/token` with `grant_type=refresh_token`. Requires `offline_access` scope in the original request.

---

## 4. Token Types and Validation

### ID Token (JWT)
- Proves user identity
- Contains claims: `sub`, `name`, `email`, `oid` (user object ID), `tid` (tenant ID), `preferred_username`
- Must validate: signature (via JWKS), `iss` (issuer), `aud` (audience = your client_id), `exp` (expiration), `nonce`
- Use a library for validation -- never do it manually

### Access Token
- Used to call APIs (Microsoft Graph, your own APIs)
- Include as `Authorization: Bearer {token}` header
- Validate only tokens intended for YOUR API -- do not validate tokens for Microsoft services

### Refresh Token
- Long-lived, used to obtain new access/id tokens
- Only issued when `offline_access` scope is requested
- SPA refresh tokens expire after 24 hours

---

## 5. Microsoft Graph API

Microsoft Graph (`https://graph.microsoft.com/v1.0/`) is the unified API for accessing user data, groups, and organizational info from Entra ID.

### 5.1 User Profile

**Endpoints:**
- `GET /me` -- signed-in user (requires delegated permission)
- `GET /users/{id | userPrincipalName}` -- specific user

**Default Properties Returned:**
`businessPhones`, `displayName`, `givenName`, `id`, `jobTitle`, `mail`, `mobilePhone`, `officeLocation`, `preferredLanguage`, `surname`, `userPrincipalName`

**Additional properties via $select:**
`department`, `companyName`, `city`, `state`, `country`, `postalCode`, `identities`, `accountEnabled`

**Example:**
```http
GET https://graph.microsoft.com/v1.0/me?$select=displayName,mail,jobTitle,department,companyName
Authorization: Bearer {access_token}
```

**Permissions:**

| Permission Type | Least Privileged | Higher Privileged |
|----------------|------------------|-------------------|
| Delegated (signed-in user) | `User.Read` | `User.ReadWrite`, `User.Read.All` |
| Application (no user) | `User.Read.All` | `Directory.Read.All` |

**NAHQ Usage:** After login, call `/me` with `User.Read` scope to get displayName, mail, jobTitle, department for the logged-in admin or hospital executive.

### 5.2 Group Membership

**Endpoints:**
- `GET /me/memberOf` -- direct group memberships of signed-in user
- `GET /users/{id}/memberOf` -- direct memberships of specific user
- `GET /users/{id}/transitiveMemberOf` -- includes nested/inherited memberships

**Response returns** `directoryObject` collection containing groups, directory roles, and administrative units. Use OData cast to filter:
- `GET /me/memberOf/microsoft.graph.group` -- only groups
- `GET /me/memberOf/$count` -- just a count

**Key Group Properties:**
`id`, `displayName`, `mailEnabled`, `securityEnabled`, `groupTypes`

**Permissions:**

| Permission Type | Least Privileged |
|----------------|------------------|
| Delegated (signed-in user, /me) | `User.Read` |
| Delegated (other user) | `User.Read.All` or `GroupMember.Read.All` |
| Application | `Directory.Read.All` |

**NAHQ Usage:** Map Entra security groups to NAHQ roles. For example:
- `NAHQ-Admin` group -> NAHQ platform admin role
- `NAHQ-Executive-HospitalA` group -> executive dashboard access for Hospital A
- Use `transitiveMemberOf` to capture nested group hierarchies

---

## 6. App Registration Steps

### 6.1 Register in Azure Portal

1. Sign in to [Microsoft Entra admin center](https://entra.microsoft.com) as Application Developer or higher
2. Navigate to Entra ID > App registrations > New registration
3. Enter name: e.g., "NAHQ Accelerate"
4. Select supported account type: **Accounts in any organizational directory** (multi-tenant)
5. Click Register
6. Record the **Application (Client) ID** and **Directory (Tenant) ID**

### 6.2 Configure Authentication

1. Go to Authentication > Add a platform > Web
2. Add redirect URIs:
   - Development: `http://localhost:8080/login/oauth2/code/`
   - Production: `https://nahq.epicdx.com/login/oauth2/code/`
3. Under Implicit grant, check **ID tokens** (for hybrid flow if needed)

### 6.3 Create Client Secret

1. Go to Certificates & secrets > New client secret
2. Add description, set expiration (recommend 6-12 months, rotate before expiry)
3. **Copy the secret value immediately** -- it cannot be retrieved later

### 6.4 Configure API Permissions

1. Go to API permissions > Add a permission
2. Select Microsoft Graph > Delegated permissions:
   - `openid` (Sign users in)
   - `profile` (View basic profile)
   - `email` (View email address)
   - `User.Read` (Read signed-in user profile)
   - `offline_access` (Maintain access -- for refresh tokens)
3. For service-to-service (optional): Add Application permissions:
   - `User.Read.All` (Read all user profiles)
   - `GroupMember.Read.All` (Read group memberships)
4. Click "Grant admin consent" for the tenant

### 6.5 App Roles (Optional -- for RBAC)

1. Go to App roles > Create app role
2. Define roles matching NAHQ authorization model:
   - `NAHQ.Admin` -- platform administrators
   - `NAHQ.Executive` -- hospital executive dashboard access
   - `NAHQ.Assessor` -- competency assessors
3. Assign users to roles via Enterprise applications > Users and groups

---

## 7. Spring Boot Integration

### 7.1 Dependencies

**Maven (pom.xml):**
```xml
<!-- BOM for version management -->
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>com.azure.spring</groupId>
      <artifactId>spring-cloud-azure-dependencies</artifactId>
      <version>7.1.0</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>

<!-- Starter dependency -->
<dependencies>
  <dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter-active-directory</artifactId>
  </dependency>
  <!-- Also needed: -->
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-client</artifactId>
  </dependency>
</dependencies>
```

**Note:** The Azure Spring starter wraps `spring-boot-starter-oauth2-client` and adds Entra-specific configuration and token validation.

### 7.2 Application Configuration

**application.properties (or application.yml):**
```properties
# Enable Entra ID features
spring.cloud.azure.active-directory.enabled=true

# Your Entra tenant ID (use 'common' or 'organizations' for multi-tenant)
spring.cloud.azure.active-directory.profile.tenant-id=organizations

# App Registration credentials
spring.cloud.azure.active-directory.credential.client-id=${AZURE_CLIENT_ID}
spring.cloud.azure.active-directory.credential.client-secret=${AZURE_CLIENT_SECRET}
```

**YAML equivalent:**
```yaml
spring:
  cloud:
    azure:
      active-directory:
        enabled: true
        profile:
          tenant-id: organizations    # multi-tenant
        credential:
          client-id: ${AZURE_CLIENT_ID}
          client-secret: ${AZURE_CLIENT_SECRET}
```

### 7.3 Security Configuration

The starter auto-configures Spring Security for OIDC login. For role-based access:

```java
@RestController
public class DashboardController {

    @GetMapping("/admin")
    @PreAuthorize("hasAuthority('APPROLE_NAHQ.Admin')")
    public String adminDashboard() {
        return "Admin dashboard";
    }

    @GetMapping("/executive")
    @PreAuthorize("hasAuthority('APPROLE_NAHQ.Executive')")
    public String executiveDashboard() {
        return "Executive dashboard";
    }
}
```

**Key:** App roles from Entra appear as `APPROLE_{roleName}` authorities in Spring Security.

### 7.4 Accessing User Claims

```java
@GetMapping("/me")
public Map<String, Object> currentUser(
        @AuthenticationPrincipal OidcUser oidcUser) {
    return Map.of(
        "name", oidcUser.getFullName(),
        "email", oidcUser.getEmail(),
        "tenantId", oidcUser.getClaim("tid"),
        "objectId", oidcUser.getClaim("oid"),
        "roles", oidcUser.getAuthorities()
    );
}
```

### 7.5 Redirect URI Convention

Spring Security OAuth2 client expects the redirect URI pattern:
```
{baseUrl}/login/oauth2/code/{registrationId}
```
Default registration ID for the Azure starter is the provider name. Register this exact URI in the Entra app registration.

---

## 8. B2B Guest Access Pattern (Hospital Executive SSO)

This is the critical pattern for NAHQ: hospital executives need to access the platform using their own hospital Entra credentials.

### 8.1 Two Approaches

**Approach A: Multi-Tenant App (Recommended for NAHQ)**
- Register app as multi-tenant (`Accounts in any organizational directory`)
- Use `organizations` as the tenant value in endpoints
- Any user from any Entra tenant can sign in
- The app receives `tid` (tenant ID) claim to identify which hospital the user belongs to
- No invitation/guest account needed -- users authenticate directly against their home tenant
- Hospital IT admin must grant consent for the app in their tenant (one-time)

**Approach B: B2B Guest Invitation**
- App is single-tenant
- Hospital executives are invited as "guest users" into the NAHQ tenant
- Guests authenticate using their home tenant credentials but appear as guest objects in the NAHQ directory
- Guest users have `#EXT#` in their UPN (e.g., `alice_hospital.org#EXT#@nahq.onmicrosoft.com`)
- More administrative overhead (must invite each user)
- Better control (explicit guest list)

### 8.2 Recommended Architecture for NAHQ

```
Multi-Tenant App Registration (NAHQ Accelerate)
  |
  +-- EpicDX/NAHQ Admins: Sign in from EpicDX tenant
  |     -> tid = EpicDX tenant ID -> admin role
  |
  +-- Hospital A Executives: Sign in from Hospital A tenant
  |     -> tid = Hospital A tenant ID -> executive role, scoped to Hospital A
  |
  +-- Hospital B Executives: Sign in from Hospital B tenant
        -> tid = Hospital B tenant ID -> executive role, scoped to Hospital B
```

**How it works:**
1. Executive visits NAHQ and clicks "Sign in with Microsoft"
2. Redirected to Microsoft login (if multi-tenant, they see their org's branded login)
3. Hospital IT admin consents to the NAHQ app on first use (or admin pre-consents)
4. After authentication, NAHQ receives ID token with:
   - `tid` = hospital's tenant ID (maps to a hospital in NAHQ's database)
   - `oid` = user's object ID in their home tenant
   - `email`, `name`, `preferred_username`
5. NAHQ maps (tid + oid) to an internal user record with appropriate permissions

### 8.3 B2B Collaboration Details

If using Approach B (guest invitation pattern):
- Guests are created as user objects in the host (NAHQ) tenant with `userType = Guest`
- Guests sign in using their home tenant credentials (federated authentication)
- Home tenant handles MFA -- the host can choose to trust home tenant MFA claims via cross-tenant access settings
- Email one-time passcode is the fallback for users without Microsoft accounts
- Cross-tenant access settings control which organizations can collaborate
- Conditional access policies can be applied specifically to guest users
- Self-service sign-up user flows can be configured for guests

### 8.4 Admin Consent for Multi-Tenant Apps

When a hospital first uses the NAHQ app:
1. Hospital admin navigates to the admin consent URL:
   ```
   https://login.microsoftonline.com/{hospital-tenant-id}/adminconsent?
     client_id={nahq-client-id}&
     redirect_uri=https://nahq.epicdx.com/consent-callback&
     state=hospital-abc-123
   ```
2. Admin reviews and approves requested permissions
3. NAHQ receives callback confirming consent was granted
4. Hospital's users can now sign in

---

## 9. Security Recommendations

1. **Always use PKCE** with the authorization code flow
2. **Use certificates** instead of client secrets in production
3. **Validate all tokens** using a library (never manually parse JWTs for security decisions)
4. **Validate `iss` (issuer) and `aud` (audience)** claims in ID tokens
5. **Use `state` parameter** to prevent CSRF
6. **Use `nonce` parameter** to prevent token replay
7. **Store secrets in environment variables** or a vault (never in source code)
8. **Rotate client secrets** before expiration
9. **Use response_mode=form_post** for web applications (prevents tokens in URL)
10. **Request minimum scopes** needed (principle of least privilege)
11. **Implement single sign-out** via front-channel logout URL for complete session cleanup
12. **Cache tokens appropriately** -- access tokens for their lifetime, refresh tokens securely server-side

---

## 10. NAHQ-Specific Implementation Plan

### Phase 1: Admin Authentication (Sandbox)
- Single-tenant app registration for EpicDX tenant
- Authorization code flow with PKCE
- Spring Boot `spring-cloud-azure-starter-active-directory`
- Scopes: `openid`, `profile`, `email`, `User.Read`
- Map Entra user to NAHQ admin role via app roles or group membership
- Microsoft Graph call to `/me` for profile enrichment

### Phase 2: Hospital Executive SSO (Production)
- Convert to multi-tenant app registration
- Use `organizations` tenant endpoint
- Implement tenant-to-hospital mapping in NAHQ database
- Admin consent flow for hospital onboarding
- Map `tid` + `oid` to NAHQ user identity
- Role assignment based on Entra group membership or NAHQ-side configuration
- Conditional access considerations (MFA trust from home tenant)

### Phase 3: Service Integration (Optional)
- Client credentials flow for backend synchronization
- Microsoft Graph application permissions for bulk user/group reads
- Scheduled sync of hospital org structure if needed

---

## References

| Source | URL | Content |
|--------|-----|---------|
| OIDC Protocol | https://learn.microsoft.com/en-us/entra/identity-platform/v2-protocols-oidc | OpenID Connect sign-in flow, ID token validation, sign-out |
| App Registration | https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app | Step-by-step registration, supported account types |
| Auth Code Flow | https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow | Full authorization code flow with PKCE, token redemption, refresh |
| Client Credentials | https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-client-creds-grant-flow | Service-to-service auth, application permissions, admin consent |
| Spring Boot + Entra | https://learn.microsoft.com/en-us/azure/developer/java/spring-framework/configure-spring-boot-starter-java-app-with-entra | Spring Cloud Azure starter, configuration, app roles |
| B2B Collaboration | https://learn.microsoft.com/en-us/entra/external-id/what-is-b2b | Guest access, cross-tenant settings, self-service sign-up |
| Graph: Get User | https://learn.microsoft.com/en-us/graph/api/user-get | User profile API, permissions, $select |
| Graph: User MemberOf | https://learn.microsoft.com/en-us/graph/api/user-list-memberof | Group membership API, OData filtering, transitive vs direct |
