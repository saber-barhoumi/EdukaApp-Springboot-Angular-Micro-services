# 🔐 Keycloak API Gateway Security - Complete Setup Guide

## 📋 Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Step 1: Install & Start Keycloak](#step-1-install--start-keycloak)
4. [Step 2: Configure Keycloak Realm & Client](#step-2-configure-keycloak-realm--client)
5. [Step 3: Setup Database](#step-3-setup-database)
6. [Step 4: Start Services](#step-4-start-services)
7. [Step 5: Test with Postman](#step-5-test-with-postman)
8. [Troubleshooting](#troubleshooting)
9. [Architecture Diagram](#architecture-diagram)

---

## 🎯 Overview

This project implements **OAuth2 JWT authentication** using Keycloak to secure the API Gateway. All requests to microservices must include a valid JWT token.

### Architecture:
```
Client/Postman → Keycloak (Get Token) → API Gateway (Validate Token) → Microservices
```

### Ports:
- **Keycloak**: 8080
- **Eureka Server**: 8761
- **API Gateway**: 8888 (changed from 8080 to avoid conflict)
- **Restaurant Service**: 8083
- **Angular Frontend**: 4200

---

## ✅ Prerequisites

Before starting, make sure you have:

- ✅ **Java 17** or higher installed
- ✅ **Maven 3.8+** installed
- ✅ **Git** installed
- ✅ **Postman** or cURL for testing
- ✅ **Latest code** from git repository (branch: Saber)

Check Java version:
```bash
java -version
# Should show: java version "17.x.x"
```

---

## 📥 Step 1: Install & Start Keycloak

### Option A: Using Docker (Recommended)

1. **Install Docker Desktop** (if not already installed)
   - Download from: https://www.docker.com/products/docker-desktop

2. **Run Keycloak Container**:
```bash
docker run -d ^
  --name keycloak-eduka ^
  -p 8080:8080 ^
  -e KEYCLOAK_ADMIN=admin ^
  -e KEYCLOAK_ADMIN_PASSWORD=admin ^
  quay.io/keycloak/keycloak:23.0.0 start-dev
```

3. **Verify Keycloak is Running**:
   - Open browser: http://localhost:8080
   - Should see Keycloak welcome page

### Option B: Download Standalone

1. **Download Keycloak 23.0.0**:
   - https://www.keycloak.org/downloads

2. **Extract and Start**:
```bash
# Windows
cd keycloak-23.0.0\bin
kc.bat start-dev

# Linux/Mac
cd keycloak-23.0.0/bin
./kc.sh start-dev
```

3. **Access Admin Console**:
   - URL: http://localhost:8080
   - Create admin user on first access

---

## ⚙️ Step 2: Configure Keycloak Realm & Client

### 2.1 Login to Keycloak Admin Console

1. Go to: http://localhost:8080
2. Click **"Administration Console"**
3. Login with:
   - Username: `admin`
   - Password: `admin`

### 2.2 Create Realm

1. In top-left dropdown (currently showing "master"), click **Create Realm**
2. Fill in:
   - **Realm name**: `Eduka-realm`
3. Click **Create**

### 2.3 Create Client

1. In left sidebar, click **Clients**
2. Click **Create client** button
3. **General Settings**:
   - **Client type**: `OpenID Connect`
   - **Client ID**: `api-gateway`
   - Click **Next**

4. **Capability config**:
   - ✅ **Client authentication**: ON
   - ✅ **Authorization**: OFF
   - **Authentication flow**:
     - ✅ Standard flow
     - ✅ Direct access grants
     - ✅ Service accounts roles
   - Click **Next**

5. **Login settings**:
   - **Root URL**: `http://localhost:8888`
   - **Home URL**: `http://localhost:8888`
   - **Valid redirect URIs**: `http://localhost:8888/*`
   - **Valid post logout redirect URIs**: `http://localhost:8888/*`
   - **Web origins**: `http://localhost:8888`
   - Click **Save**

### 2.4 Get Client Secret

1. Go to **Clients** → **api-gateway**
2. Click **Credentials** tab
3. **Copy the Client Secret** (you'll need this for Postman)
   - Example: `jcoVdzzSUXbovTkCwRnsF1Aj2odYn5yc`
   - ⚠️ **IMPORTANT**: Your secret will be different! Use YOUR secret!

### 2.5 Verify Token Endpoint

Your Keycloak token endpoint is:
```
http://localhost:8080/realms/Eduka-realm/protocol/openid-connect/token
```

Test it with cURL:
```bash
curl -X POST http://localhost:8080/realms/Eduka-realm/protocol/openid-connect/token ^
  -d "grant_type=client_credentials" ^
  -d "client_id=api-gateway" ^
  -d "client_secret=YOUR_CLIENT_SECRET_HERE"
```

Should return JSON with `access_token` field.

---

## 💾 Step 3: Setup Database

The restaurant service uses **H2 file-based database** at `./data/restaurant_management_db`.

### Option 1: Create Sample Data (Fresh Start)

1. Navigate to restaurant service directory:
```bash
cd microservices\restaurant-management-service
```

2. Delete existing database (if any):
```bash
# Windows
rmdir /s /q data

# Linux/Mac
rm -rf data
```

3. Start service (will create database with sample data):
```bash
.\mvnw spring-boot:run
```

4. Add sample restaurants via H2 Console:
   - URL: http://localhost:8083/h2-console
   - JDBC URL: `jdbc:h2:file:./data/restaurant_management_db`
   - Username: `sa`
   - Password: (leave empty)
   - Click **Connect**

5. Run SQL:
```sql
INSERT INTO restaurants (name, address, type, description, phone_number, email, opening_hours, is_active, created_at, updated_at) 
VALUES 
  ('Campus Cafeteria', '123 University Ave', 'Cafeteria', 'Main campus dining hall', '555-0100', 'cafeteria@eduka.edu', '7:00 AM - 9:00 PM', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Pizza Corner', '456 Student St', 'Fast Food', 'Quick pizza and pasta', '555-0200', 'pizza@eduka.edu', '11:00 AM - 11:00 PM', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Healthy Bites', '789 Wellness Rd', 'Health Food', 'Organic and healthy options', '555-0300', 'healthy@eduka.edu', '8:00 AM - 8:00 PM', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
```

### Option 2: Share Database File (Recommended for Team)

**For the person who has working data (YOU):**

1. Locate database file:
```
microservices\restaurant-management-service\data\restaurant_management_db.mv.db
```

2. Share this file with your team (via Google Drive, Teams, etc.)
   - ⚠️ Don't commit to Git (already in .gitignore)

**For team members:**

1. Receive the `restaurant_management_db.mv.db` file
2. Create `data` folder in restaurant service:
```bash
cd microservices\restaurant-management-service
mkdir data
```

3. Copy the `.mv.db` file into the `data` folder

---

## 🚀 Step 4: Start Services

Start services in this exact order:

### 4.1 Start Eureka Server

```bash
cd infrastructure\eureka-server
mvn spring-boot:run
```

Wait until you see: `Started EurekaServerApplication`

Verify: http://localhost:8761 (should see Eureka dashboard)

### 4.2 Start API Gateway

```bash
cd infrastructure\api-gateway
mvn spring-boot:run
```

Wait until you see: `Started ApiGatewayApplication` and `Netty started on port 8888`

### 4.3 Start Restaurant Management Service

```bash
cd microservices\restaurant-management-service
.\mvnw spring-boot:run
```

Wait until you see: `Started edukaApplication` and `Tomcat started on port(s): 8083`

### 4.4 Verify All Services Registered

Open Eureka dashboard: http://localhost:8761

Should see:
- ✅ **API-GATEWAY** (1 instance)
- ✅ **RESTAURANT-MANAGEMENT-SERVICE** (1 instance)

⏱️ Wait 30 seconds for full synchronization before testing!

---

## 🧪 Step 5: Test with Postman

### 5.1 Import Postman Collection (Optional)

You can create a collection or follow manual steps below.

### 5.2 Get JWT Token

**Request Setup:**

- **Method**: `POST`
- **URL**: `http://localhost:8080/realms/Eduka-realm/protocol/openid-connect/token`
- **Headers**: 
  - `Content-Type`: `application/x-www-form-urlencoded`
- **Body** (x-www-form-urlencoded):
  ```
  grant_type: client_credentials
  client_id: api-gateway
  client_secret: YOUR_CLIENT_SECRET_FROM_STEP_2.4
  ```

**Send Request** → Should receive:
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cC...",
  "expires_in": 300,
  "refresh_expires_in": 0,
  "token_type": "Bearer",
  ...
}
```

**Copy the `access_token` value** (you'll need it next)

### 5.3 Configure OAuth 2.0 in Postman (Easier Method)

1. Create new request: `GET http://localhost:8888/api/restaurants`

2. Go to **Authorization** tab:
   - **Type**: `OAuth 2.0`
   - **Add auth data to**: `Request Headers`

3. Click **Configure New Token**:
   - **Token Name**: `EdukaKeycloakToken`
   - **Grant Type**: `Client Credentials`
   - **Access Token URL**: `http://localhost:8080/realms/Eduka-realm/protocol/openid-connect/token`
   - **Client ID**: `api-gateway`
   - **Client Secret**: `YOUR_CLIENT_SECRET`
   - **Scope**: `openid`
   - **Client Authentication**: `Send as Basic Auth header`

4. Click **Get New Access Token**

5. Click **Use Token**

### 5.4 Test GET All Restaurants

**Request:**
- **Method**: `GET`
- **URL**: `http://localhost:8888/api/restaurants`
- **Authorization**: Use token from above

**Expected Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Campus Cafeteria",
    "address": "123 University Ave",
    "type": "Cafeteria",
    "description": "Main campus dining hall",
    "phoneNumber": "555-0100",
    "email": "cafeteria@eduka.edu",
    "openingHours": "7:00 AM - 9:00 PM",
    "imageUrl": "",
    "isActive": true,
    "createdAt": "2025-11-05T21:57:29.889889",
    "updatedAt": "2025-11-05T21:57:29.889889"
  },
  ...
]
```

### 5.5 Test Without Token (Should Fail)

**Request:**
- **Method**: `GET`
- **URL**: `http://localhost:8888/api/restaurants`
- **Authorization**: `No Auth`

**Expected Response (401 Unauthorized):**
```json
{
  "error": "unauthorized"
}
```

This confirms security is working! ✅

---

## 🔧 Troubleshooting

### Problem 1: "Connection refused: localhost:8080"

**Cause**: Keycloak not running

**Solution**:
```bash
# Check if Keycloak is running
docker ps | findstr keycloak

# If not running, start it
docker start keycloak-eduka
```

### Problem 2: "401 Unauthorized" from Gateway

**Cause**: Invalid token or wrong issuer-uri

**Solutions**:
1. Check Gateway `application.properties`:
   ```properties
   spring.security.oauth2.resourceserver.jwt.issuer-uri=http://localhost:8080/realms/Eduka-realm
   ```

2. Verify realm name is exactly `Eduka-realm` (case-sensitive)

3. Get a fresh token from Keycloak

### Problem 3: "503 Service Unavailable"

**Cause**: Restaurant service not registered with Eureka

**Solutions**:
1. Check Eureka dashboard: http://localhost:8761
2. Restart restaurant service
3. Wait 30 seconds for registration
4. Check service logs for errors

### Problem 4: Returns `[]` (Empty Array)

**Cause**: Database has no data or wrong database path

**Solutions**:
1. Check `application.properties`:
   ```properties
   spring.datasource.url=jdbc:h2:file:./data/restaurant_management_db
   ```
   Must be `./data/` not `${user.home}/.eduka/`!

2. Verify database file exists:
   ```
   microservices\restaurant-management-service\data\restaurant_management_db.mv.db
   ```

3. Check service logs for:
   ```
   DEBUG: Found 3 restaurants
   ```

4. If still empty, add data via H2 Console (see Step 3)

### Problem 5: "Port 8888 already in use"

**Cause**: Another process using port 8888

**Solutions**:

**Windows:**
```bash
# Find process using port 8888
netstat -ano | findstr :8888

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**Linux/Mac:**
```bash
# Find process
lsof -i :8888

# Kill process
kill -9 <PID>
```

### Problem 6: "Invalid client secret"

**Cause**: Using wrong client secret

**Solution**:
1. Go to Keycloak Admin Console
2. **Clients** → **api-gateway** → **Credentials** tab
3. Copy the ACTUAL secret (don't use example secret!)
4. Update Postman configuration

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Postman/Frontend)                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                   ┌─────────┴──────────┐
                   │                    │
              1. Get Token         3. API Request
                   │                with Token
                   ▼                    │
         ┌──────────────────┐          │
         │    KEYCLOAK      │          │
         │   Port: 8080     │          │
         │                  │          │
         │ Realm: Eduka-    │          │
         │ Client: api-     │          │
         │ gateway          │          │
         └──────────────────┘          │
                   │                    │
              2. JWT Token              │
                   │                    │
                   └────────────────────▼
                            ┌──────────────────────┐
                            │   API GATEWAY        │
                            │   Port: 8888         │
                            │                      │
                            │ - Validate JWT       │
                            │ - Check Issuer       │
                            │ - Route Request      │
                            └──────────┬───────────┘
                                       │
                                       ▼
                            ┌──────────────────────┐
                            │  EUREKA SERVER       │
                            │  Port: 8761          │
                            │                      │
                            │  Service Discovery   │
                            └──────────┬───────────┘
                                       │
                                       ▼
                      ┌────────────────────────────────┐
                      │  RESTAURANT SERVICE            │
                      │  Port: 8083                    │
                      │                                │
                      │  - Business Logic              │
                      │  - Database Access             │
                      └────────────────┬───────────────┘
                                       │
                                       ▼
                              ┌──────────────┐
                              │  H2 DATABASE │
                              │              │
                              │  ./data/     │
                              └──────────────┘
```

---

## 📝 Configuration Files Summary

### API Gateway (`infrastructure/api-gateway/application.properties`)

```properties
server.port=8888
spring.application.name=api-gateway

# Eureka
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/

# OAuth2 Resource Server
spring.security.oauth2.resourceserver.jwt.issuer-uri=http://localhost:8080/realms/Eduka-realm

# Routes
spring.cloud.gateway.routes[0].id=restaurant-management-service
spring.cloud.gateway.routes[0].uri=lb://RESTAURANT-MANAGEMENT-SERVICE
spring.cloud.gateway.routes[0].predicates[0]=Path=/api/restaurants/**
```

### Restaurant Service (`microservices/restaurant-management-service/application.properties`)

```properties
server.port=8083
spring.application.name=restaurant-management-service

# Database (IMPORTANT: Must be ./data/)
spring.datasource.url=jdbc:h2:file:./data/restaurant_management_db
spring.datasource.username=sa
spring.datasource.password=

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# H2 Console
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# Eureka
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
```

---

## ✅ Quick Verification Checklist

Before reporting issues, verify:

- [ ] Java 17+ installed (`java -version`)
- [ ] Keycloak running on port 8080 (http://localhost:8080)
- [ ] Realm `Eduka-realm` exists in Keycloak
- [ ] Client `api-gateway` exists with correct secret
- [ ] Eureka running on port 8761 (http://localhost:8761)
- [ ] API Gateway running on port 8888
- [ ] Restaurant Service running on port 8083
- [ ] Database file exists at `microservices/restaurant-management-service/data/restaurant_management_db.mv.db`
- [ ] All services show as "UP" in Eureka dashboard
- [ ] Can get JWT token from Keycloak
- [ ] Token works in Postman for API requests

---

## 🎓 Additional Resources

- **Keycloak Documentation**: https://www.keycloak.org/documentation
- **Spring Cloud Gateway**: https://spring.io/projects/spring-cloud-gateway
- **OAuth 2.0**: https://oauth.net/2/
- **JWT**: https://jwt.io/

---

## 👥 Team Collaboration Tips

1. **Share Keycloak Client Secret Securely**:
   - Don't commit to Git
   - Share via encrypted message or team vault
   - Each developer can use the same secret for development

2. **Database Sharing**:
   - One person creates sample data
   - Share the `.mv.db` file via cloud storage
   - Everyone copies to their local `./data/` folder

3. **Service Startup Order**:
   - Always start Eureka first
   - Then Gateway and microservices
   - Wait 30 seconds between starts

4. **Common Mistakes**:
   - ❌ Forgetting to start Keycloak
   - ❌ Wrong database path (${user.home} instead of ./data/)
   - ❌ Using example client secret instead of actual one
   - ❌ Not waiting for Eureka synchronization

---

## 📞 Support

If you encounter issues not covered in this guide:

1. Check service logs for error messages
2. Verify all services are running with `netstat -ano | findstr :PORT`
3. Test each component independently:
   - Keycloak token endpoint
   - Eureka service registry
   - Restaurant service directly (http://localhost:8083/api/restaurants)
   - API Gateway routing

---

**Last Updated**: November 6, 2025  
**Version**: 1.0  
**Author**: Saber  
**Project**: EdukaApp - Restaurant Management System
