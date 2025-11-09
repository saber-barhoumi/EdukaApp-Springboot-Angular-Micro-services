# Keycloak Integration Setup Guide

This guide will help you set up Keycloak authentication for the eduka Spring Boot application.

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- Keycloak server (version 22.0.5 or higher)
- MySQL database (for Keycloak)

## 1. Keycloak Server Setup

### 1.1 Download and Install Keycloak

1. Download Keycloak from: https://www.keycloak.org/downloads
2. Extract the archive to your desired location
3. Start Keycloak server:
   ```bash
   cd keycloak-22.0.5/bin
   ./standalone.sh  # For Linux/Mac
   # or
   standalone.bat   # For Windows
   ```

### 1.2 Initial Setup

1. Access Keycloak admin console: http://localhost:8080
2. Create an admin user (first time only)
3. Log in with your admin credentials

## 2. Keycloak Configuration

### 2.1 Create a Realm

1. In the admin console, click "Create Realm"
2. Name: `eduka-realm`
3. Click "Create"

### 2.2 Create a Client

1. Go to "Clients" → "Create client"
2. Client ID: `eduka-client`
3. Client Protocol: `openid-connect`
4. Click "Save"

### 2.3 Configure Client Settings

1. **Access Type**: `public`
2. **Valid Redirect URIs**: 
   - `http://localhost:4200/*` (for Angular frontend)
   - `http://localhost:4200`
3. **Web Origins**: `http://localhost:4200`
4. **Advanced Settings**:
   - Access Token Lifespan: `15 minutes`
   - Client Session Idle: `30 minutes`
   - Client Session Max: `60 minutes`

### 2.4 Create Roles

1. Go to "Roles" → "Create role"
2. Create the following roles:
   - `user` (Realm role)
   - `admin` (Realm role)

### 2.5 Create Users

1. Go to "Users" → "Add user"
2. Create test users:

**Admin User:**
- Username: `admin`
- Email: `admin@eduka.com`
- First Name: `Admin`
- Last Name: `User`
- Email Verified: `ON`

**Regular User:**
- Username: `user`
- Email: `user@eduka.com`
- First Name: `Regular`
- Last Name: `User`
- Email Verified: `ON`

### 2.6 Assign Roles to Users

1. Go to each user's "Role Mappings" tab
2. Assign appropriate roles:
   - Admin user: `admin`, `user`
   - Regular user: `user`

### 2.7 Set User Passwords

1. Go to each user's "Credentials" tab
2. Set temporary password: `password123`
3. Turn OFF "Temporary" flag
4. Click "Set Password"

## 3. Application Configuration

### 3.1 Update application.properties

The application.properties file is already configured with the correct Keycloak settings:

```properties
# Keycloak OAuth2 Resource Server Configuration
spring.security.oauth2.resourceserver.jwt.issuer-uri=http://localhost:8080/realms/eduka-realm
spring.security.oauth2.resourceserver.jwt.jwk-set-uri=http://localhost:8080/realms/eduka-realm/protocol/openid-connect/certs
```

### 3.2 Update Client ID in KeycloakJwtAuthenticationConverter

If your client ID is different from `eduka-client`, update it in:
`src/main/java/com/ski/eduka/security/KeycloakJwtAuthenticationConverter.java`

## 4. Testing the Integration

### 4.1 Start the Application

```bash
mvn spring-boot:run
```

### 4.2 Test Endpoints

1. **Public endpoint** (no authentication required):
   ```bash
   curl http://localhost:8081/api/public/hello
   ```

2. **Get access token** (using Keycloak):
   ```bash
   curl -X POST http://localhost:8080/realms/eduka-realm/protocol/openid-connect/token \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "client_id=eduka-client" \
     -d "username=user" \
     -d "password=password123" \
     -d "grant_type=password"
   ```

3. **Test authenticated endpoints** (replace `YOUR_ACCESS_TOKEN` with the token from step 2):
   ```bash
   # User profile
   curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
     http://localhost:8081/api/user/profile
   
   # Check role
   curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
     http://localhost:8081/api/user/check-role/user
   
   # Admin dashboard (requires admin role)
   curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
     http://localhost:8081/api/admin/dashboard
   ```

## 5. Available Endpoints

### Public Endpoints
- `GET /api/public/hello` - Public greeting

### Authenticated Endpoints
- `GET /api/auth/current-user` - Get current user info
- `GET /api/user/profile` - Get user profile (requires USER or ADMIN role)
- `GET /api/user/check-role/{role}` - Check if user has specific role
- `GET /api/admin/dashboard` - Admin dashboard (requires ADMIN role)

## 6. Troubleshooting

### Common Issues

1. **CORS errors**: Ensure CORS is properly configured in both Keycloak and Spring Boot
2. **Token validation errors**: Check that the issuer URI and JWK set URI are correct
3. **Role mapping issues**: Verify roles are properly assigned to users in Keycloak
4. **Client configuration**: Ensure the client is public and redirect URIs are correct

### Debug Logging

Enable debug logging by adding to `application.properties`:
```properties
logging.level.org.springframework.security=DEBUG
logging.level.org.springframework.web.cors=DEBUG
logging.level.com.ski.eduka=DEBUG
```

## 7. Frontend Integration

For Angular frontend integration, you'll need to:

1. Install Keycloak Angular adapter
2. Configure Keycloak initialization
3. Handle token refresh
4. Implement logout functionality

The backend is now ready to accept JWT tokens from Keycloak and validate them properly. 