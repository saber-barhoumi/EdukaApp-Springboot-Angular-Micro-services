# API Gateway Security with Keycloak - EdukaApp

This guide explains how to secure your API Gateway using Keycloak OAuth2.0 authentication.

## 🎯 Objective

- Secure the API Gateway using OAuth2.0
- Ensure secure access to all microservices through the Gateway
- Validate JWT tokens issued by Keycloak

## 🔧 Architecture Overview

When accessing microservices through the Gateway:
1. Gateway redirects unauthenticated requests → User denied access (401)
2. Client obtains JWT token from Keycloak → Uses client credentials
3. Client sends requests with JWT token → Gateway validates token
4. Valid token → Request forwarded to microservice
5. Invalid/missing token → 401 Unauthorized

---

## 📋 Step-by-Step Configuration

### Step 1: Keycloak Realm Configuration

1. **Access Keycloak Admin Console**: http://localhost:8080
   - Default credentials: `admin` / `admin`

2. **Create a New Realm**:
   - Click on the realm dropdown (top left)
   - Click "Create Realm"
   - **Realm name**: `Eduka-realm`
   - Click "Create"

### Step 2: Create Client for API Gateway

1. **Navigate to Clients**:
   - In the left sidebar, click "Clients"
   - Click "Create client"

2. **General Settings**:
   - **Client ID**: `api-gateway`
   - **Name**: `EdukaApp API Gateway`
   - **Client authentication**: `ON` (to enable client credentials flow)
   - Click "Next"

3. **Capability Config**:
   - **Client authentication**: `ON`
   - **Authorization**: `OFF`
   - **Standard flow**: `OFF`
   - **Direct access grants**: `OFF`
   - **Service accounts roles**: `ON` ✅ (This enables Client Credentials Grant)
   - Click "Next"

4. **Login Settings**:
   - **Root URL**: `http://localhost:8080`
   - **Home URL**: `http://localhost:8080`
   - **Valid redirect URIs**: `http://localhost:8080/*`
   - **Valid post logout redirect URIs**: `http://localhost:8080/*`
   - **Web origins**: `http://localhost:4200` (Angular frontend)
   - Click "Save"

5. **Get Client Secret**:
   - Go to the "Credentials" tab
   - Copy the **Client Secret** (you'll need this for Postman)
   - Example: `aBcDeFgH1234567890...`

### Step 3: Verify Configuration ✅

All code changes have been applied:

#### ✅ Dependencies Added (pom.xml)
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webflux</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-resource-server</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

#### ✅ SecurityConfig Created
- Location: `infrastructure/api-gateway/src/main/java/com/ski/eduka/gateway/config/SecurityConfig.java`
- Allows `/eureka/**` without authentication
- All other routes require JWT authentication

#### ✅ Application Properties Updated
```properties
spring.security.oauth2.resourceserver.jwt.issuer-uri=http://localhost:8080/realms/Eduka-realm
```

---

## 🧪 Testing the Secured Gateway

### Prerequisites
1. Start Keycloak on port 8080
2. Start Eureka Server on port 8761
3. Start at least one microservice (e.g., restaurant-management-service on port 8083)
4. Start API Gateway on port 8080

### Test 1: Access Without Token (Should Fail ❌)

**Using Browser or Postman:**
```
GET http://localhost:8080/api/restaurants
```

**Expected Response**: `401 Unauthorized`

### Test 2: Generate Keycloak Token

**Using Postman:**

1. **Create New Request**:
   - Method: `POST`
   - URL: Will be configured in Authorization tab

2. **Configure Authorization**:
   - Go to "Authorization" tab
   - Type: `OAuth 2.0`
   - Click "Get New Access Token"

3. **Token Configuration**:
   - **Token Name**: `EdukaKeycloakToken`
   - **Grant Type**: `Client Credentials`
   - **Access Token URL**: `http://localhost:8080/realms/Eduka-realm/protocol/openid-connect/token`
   - **Client ID**: `api-gateway`
   - **Client Secret**: (paste the secret from Keycloak Credentials tab)
   - **Scope**: `openid offline_access`
   - **Client Authentication**: `Send as Basic Auth header`

4. **Get Token**:
   - Click "Get New Access Token"
   - You should see a success message with the token
   - Click "Use Token"

### Test 3: Access With Token (Should Succeed ✅)

**Using Postman with Token:**
```
GET http://localhost:8080/api/restaurants
Authorization: Bearer <your-token-here>
```

**Expected Response**: `200 OK` with restaurant data

---

## 🔍 How to Get Token Endpoint URL

If you need to find the Token Endpoint URL manually:

1. Go to Keycloak Admin Console
2. Click on your realm (`Eduka-realm`)
3. Click "Realm Settings" (left sidebar)
4. Click "General" tab
5. In "Endpoints" section, click "OpenID Endpoint Configuration"
6. Look for `"token_endpoint"` in the JSON response
7. Example: `http://localhost:8080/realms/Eduka-realm/protocol/openid-connect/token`

---

## 📝 Important Notes

### Gateway Port Configuration
- **Current Setup**: Gateway is on port `8080`
- **Keycloak**: Also on port `8080`
- ⚠️ **PORT CONFLICT**: You need to change one of them!

**Option 1**: Change Gateway port to `8888`
```properties
# In infrastructure/api-gateway/src/main/resources/application.properties
server.port=8888
```

Then update Keycloak client URLs to `http://localhost:8888`

**Option 2**: Run Keycloak on different port (e.g., 8180)
```properties
# Update issuer-uri in application.properties
spring.security.oauth2.resourceserver.jwt.issuer-uri=http://localhost:8180/realms/Eduka-realm
```

### Scope Explanation
- **`openid`**: Provides ID Token to prove user identity
- **`offline_access`**: Provides Refresh Token for continuous access even after session ends

### Frontend Integration
Your Angular app will need to:
1. Obtain token from Keycloak
2. Store token securely (e.g., in memory or localStorage)
3. Include token in all API requests: `Authorization: Bearer <token>`

---

## 🐛 Troubleshooting

### Error: "Invalid token"
- Check that token is not expired (default: 5 minutes)
- Verify issuer-uri matches your Keycloak realm URL exactly
- Ensure Keycloak is running

### Error: "401 Unauthorized" even with token
- Verify token is included in Authorization header
- Check SecurityConfig allows the endpoint path
- Verify client has "Service accounts roles" enabled

### Error: "CORS error"
- Add your frontend URL to Keycloak client's "Web origins"
- Verify Gateway CORS configuration includes your frontend URL

### Port Conflict
- Make sure Gateway and Keycloak run on different ports
- Update all URLs accordingly

---

## ✅ Verification Checklist

- [ ] Keycloak is running on port 8080 (or 8180)
- [ ] Realm "Eduka-realm" created
- [ ] Client "api-gateway" created with Service Accounts enabled
- [ ] Client Secret obtained from Credentials tab
- [ ] Gateway dependencies added to pom.xml
- [ ] SecurityConfig.java created
- [ ] application.properties updated with issuer-uri
- [ ] Eureka Server running on port 8761
- [ ] At least one microservice running (e.g., port 8083)
- [ ] Gateway running on port 8888 (or 8080 if Keycloak on different port)
- [ ] Can obtain token from Keycloak via Postman
- [ ] Can access microservices through Gateway with token

---

## 📚 Next Steps

1. **Resolve Port Conflict**: Choose which service runs on which port
2. **Configure Keycloak**: Follow Step 1 & 2 above
3. **Restart Gateway**: Run `mvn spring-boot:run` from `infrastructure/api-gateway`
4. **Test with Postman**: Follow Test 2 & 3 above
5. **Integrate with Angular**: Add token authentication to frontend

---

## 🔗 Useful URLs

- **Keycloak Admin Console**: http://localhost:8080 (or 8180)
- **Eureka Dashboard**: http://localhost:8761
- **API Gateway**: http://localhost:8888 (or 8080)
- **Restaurant Service**: http://localhost:8083
- **Angular Frontend**: http://localhost:4200

---

**Configuration completed! Now proceed to configure Keycloak in the Admin Console.**
