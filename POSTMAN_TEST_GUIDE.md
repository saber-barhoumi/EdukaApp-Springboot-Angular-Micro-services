# Postman Test Collection for EdukaApp Gateway Security

## Collection: EdukaApp Gateway Tests

### 1. Test Without Token (Should Fail)

**Request Name**: `Get Restaurants - No Auth`
- **Method**: GET
- **URL**: `http://localhost:8888/api/restaurants`
- **Headers**: None
- **Expected Response**: `401 Unauthorized`

---

### 2. Get Keycloak Token

**Request Name**: `Get Keycloak Token`
- **Method**: POST
- **URL**: `http://localhost:8080/realms/Eduka-realm/protocol/openid-connect/token`
- **Headers**:
  - `Content-Type`: `application/x-www-form-urlencoded`
- **Body** (x-www-form-urlencoded):
  ```
  grant_type=client_credentials
  client_id=api-gateway
  client_secret=<YOUR_CLIENT_SECRET_FROM_KEYCLOAK>
  scope=openid offline_access
  ```
- **Expected Response**: 
  ```json
  {
    "access_token": "eyJhbGciOiJSUzI1NiIsInR5cC...",
    "expires_in": 300,
    "refresh_expires_in": 1800,
    "token_type": "Bearer",
    "scope": "openid offline_access"
  }
  ```

**Alternative: Use OAuth 2.0 Authorization Tab**
1. Select "OAuth 2.0" in Authorization tab
2. Click "Get New Access Token"
3. Fill in:
   - Token Name: `EdukaKeycloakToken`
   - Grant Type: `Client Credentials`
   - Access Token URL: `http://localhost:8080/realms/Eduka-realm/protocol/openid-connect/token`
   - Client ID: `api-gateway`
   - Client Secret: `<YOUR_CLIENT_SECRET>`
   - Scope: `openid offline_access`
   - Client Authentication: `Send as Basic Auth header`
4. Click "Get New Access Token"
5. Click "Use Token"

---

### 3. Test With Token (Should Succeed)

**Request Name**: `Get Restaurants - With Auth`
- **Method**: GET
- **URL**: `http://localhost:8888/api/restaurants`
- **Headers**:
  - `Authorization`: `Bearer <paste_your_access_token_here>`
- **Expected Response**: `200 OK` with restaurant data

---

### 4. Test Create Restaurant With Token

**Request Name**: `Create Restaurant - With Auth`
- **Method**: POST
- **URL**: `http://localhost:8888/api/restaurants`
- **Headers**:
  - `Authorization`: `Bearer <paste_your_access_token_here>`
  - `Content-Type`: `application/json`
- **Body** (raw JSON):
  ```json
  {
    "name": "Campus Cafeteria",
    "type": "Cafeteria",
    "address": "Building A, Ground Floor",
    "phoneNumber": "20123456",
    "email": "cafeteria@eduka.edu",
    "description": "Main campus cafeteria serving daily meals",
    "openingHours": "8:00 AM - 8:00 PM",
    "isActive": true
  }
  ```
- **Expected Response**: `201 Created` with restaurant object

---

### 5. Test Menu Items With Token

**Request Name**: `Get Menu Items - With Auth`
- **Method**: GET
- **URL**: `http://localhost:8888/api/menu-items`
- **Headers**:
  - `Authorization`: `Bearer <paste_your_access_token_here>`
- **Expected Response**: `200 OK` with menu items data

---

## Environment Variables (Optional)

Create a Postman environment with these variables:

```json
{
  "name": "EdukaApp",
  "values": [
    {
      "key": "gateway_url",
      "value": "http://localhost:8888",
      "enabled": true
    },
    {
      "key": "keycloak_url",
      "value": "http://localhost:8080",
      "enabled": true
    },
    {
      "key": "realm",
      "value": "Eduka-realm",
      "enabled": true
    },
    {
      "key": "client_id",
      "value": "api-gateway",
      "enabled": true
    },
    {
      "key": "client_secret",
      "value": "YOUR_CLIENT_SECRET_HERE",
      "enabled": true
    },
    {
      "key": "access_token",
      "value": "",
      "enabled": true
    }
  ]
}
```

Then use variables in requests:
- `{{gateway_url}}/api/restaurants`
- `{{keycloak_url}}/realms/{{realm}}/protocol/openid-connect/token`
- `Bearer {{access_token}}`

---

## cURL Commands (Alternative to Postman)

### Get Token:
```bash
curl -X POST http://localhost:8080/realms/Eduka-realm/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=api-gateway" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "scope=openid offline_access"
```

### Test With Token:
```bash
curl -X GET http://localhost:8888/api/restaurants \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Notes

1. **Token Expiration**: Default token lifetime is 5 minutes. Get a new token when expired.
2. **Client Secret**: Get from Keycloak → Clients → api-gateway → Credentials tab
3. **Port 8888**: Change to 8080 if Keycloak is on different port
4. **Scope**: `openid offline_access` provides both ID token and refresh token
