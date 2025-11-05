# OpenFeign Integration - Service Communication Setup

## Overview
Implemented OpenFeign for synchronous communication between **Restaurant Management Service** (Spring Boot) and **User Management Service** (Node.js) to validate users before creating orders.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                 Restaurant Service (8083)               │
│                                                          │
│  ┌────────────┐     ┌─────────────┐     ┌────────────┐│
│  │OrderService│────▶│ UserClient  │────▶│OpenFeign   ││
│  │            │     │(Feign       │     │HTTP Client ││
│  │            │     │Interface)   │     │            ││
│  └────────────┘     └─────────────┘     └─────┬──────┘│
│                                                │        │
└────────────────────────────────────────────────┼────────┘
                                                 │
                                          HTTP GET
                                                 │
                                                 ▼
┌─────────────────────────────────────────────────────────┐
│            User Management Service (3000)                │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ GET /api/users/:id/validate                       │ │
│  │ Returns: boolean (true if user exists)             │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Changes Made

### 1. Spring Boot Restaurant Service

#### Added Dependencies (pom.xml)
```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

#### Enabled Feign Clients (edukaApplication.java)
```java
@EnableFeignClients(basePackages = "com.eduka.restaurant.client")
```

#### Created Feign Client Interface (UserClient.java)
- **Location**: `src/main/java/com/eduka/restaurant/client/UserClient.java`
- **Purpose**: Defines HTTP methods to call User Management Service
- **Methods**:
  - `getUser(Long id)` - Fetch user details
  - `validateUser(Long id)` - Check if user exists (returns Boolean)

#### Created UserDTO (UserDTO.java)
- **Location**: `src/main/java/com/eduka/restaurant/dto/UserDTO.java`
- **Purpose**: Data Transfer Object matching Node.js User model
- **Fields**: id, username, email, role, firstName, lastName, active

#### Updated OrderService
- **Added**: `UserClient` injection
- **Added**: `validateUser()` private method with error handling
- **Modified**: `createOrder()` to validate user before creating order
- **Error Handling**: 
  - Throws exception if user not found
  - Handles Feign communication errors (service unavailable)

### 2. Node.js User Management Service

#### Updated User Routes (userRoutes.js)
- **Added**: `GET /api/users/:id/validate` endpoint
- **Purpose**: Returns boolean indicating if user exists
- **No Authentication Required**: Allows inter-service communication
- **Route Order**: Placed BEFORE `/:id` route to avoid conflicts

## How It Works

### Order Creation Flow with User Validation

```
1. Client creates order via REST API
   POST /api/orders
   Body: { userId: 123, restaurantId: 1, ... }
   
2. OrderService.createOrder() is called
   ↓
3. validateUser(userId) called internally
   ↓
4. UserClient.validateUser(userId) triggers Feign
   ↓
5. HTTP GET http://localhost:3000/api/users/123/validate
   ↓
6. Node.js User Service checks MongoDB
   ↓
7. Returns: true (user exists) or false (not found)
   ↓
8. If false → RuntimeException("User not found")
   If true → Continue order creation
   ↓
9. Order saved to database
```

## Testing Guide

### Prerequisites
1. **MongoDB** - User service requires MongoDB connection
2. **PostgreSQL/H2** - Restaurant service database
3. **Eureka Server** (optional) - For service discovery

### Start Services

#### 1. Start User Management Service (Node.js)
```bash
cd user-management-nodejs
npm install
node index.js
```
Expected output: `User management service running on port 3000`

#### 2. Start Restaurant Management Service (Spring Boot)
```bash
cd microservices/restaurant-management-service
mvn spring-boot:run
```
Expected output: Service starts on port 8083

### Test Scenarios

#### Test 1: Create Order with Valid User
```http
POST http://localhost:8083/api/orders
Content-Type: application/json

{
  "userId": 123,
  "restaurantId": 1,
  "menuItemIds": [1, 2],
  "deliveryAddress": "123 Main St",
  "notes": "Extra sauce"
}
```
**Expected**: Order created successfully ✅

#### Test 2: Create Order with Invalid User
```http
POST http://localhost:8083/api/orders
Content-Type: application/json

{
  "userId": 99999,
  "restaurantId": 1,
  "menuItemIds": [1, 2]
}
```
**Expected**: Error 500 - "User not found with id: 99999" ❌

#### Test 3: Validate Endpoint Directly
```http
GET http://localhost:3000/api/users/123/validate
```
**Expected**: `true` if user exists, `false` otherwise

### Verify User Exists in MongoDB

Use the debug endpoint:
```http
GET http://localhost:3000/api/auth/debug-users
```
This returns all users with their IDs for testing.

## Error Handling

### Feign Exceptions Handled
1. **FeignException.NotFound (404)** - User doesn't exist
2. **FeignException (generic)** - Service unavailable, network error, timeout

### Custom Error Messages
- `"User not found with id: {userId}"` - User validation failed
- `"Unable to validate user. User service may be unavailable"` - Communication error

## Configuration

### Feign Client Configuration
```java
@FeignClient(
    name = "user-management-service",
    url = "http://localhost:3000"  // Hardcoded for development
)
```

### Future Improvements
1. **Use Eureka for Service Discovery** - Remove hardcoded URL
   ```java
   @FeignClient(name = "user-management-service")  // Will use Eureka
   ```

2. **Add Feign Timeout Configuration**
   ```yaml
   feign:
     client:
       config:
         default:
           connectTimeout: 5000
           readTimeout: 5000
   ```

3. **Implement Circuit Breaker (Resilience4j)**
   ```java
   @CircuitBreaker(name = "userService", fallbackMethod = "validateUserFallback")
   ```

4. **Add Response Caching** - Cache user validation results

5. **Implement Retry Logic**
   ```yaml
   feign:
     client:
       config:
         user-management-service:
           retryer:
             period: 100
             maxAttempts: 3
   ```

## API Endpoints Summary

### Restaurant Service (Spring Boot - Port 8083)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create order (validates user) |
| GET | `/api/orders` | Get all orders |
| GET | `/api/orders/{id}` | Get order by ID |
| PUT | `/api/orders/{id}` | Update order |

### User Service (Node.js - Port 3000)
| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/users/:id/validate` | ❌ No | Validate user exists |
| GET | `/api/users/:id` | ✅ Yes | Get user details |
| GET | `/api/users` | ✅ Yes | Get all users |

## Troubleshooting

### Issue: "Connection refused" when creating order
**Solution**: Ensure User Management Service is running on port 3000

### Issue: "User not found" but user exists
**Solution**: 
1. Check user ID format (MongoDB ObjectId vs Long)
2. Verify MongoDB connection
3. Test validation endpoint directly

### Issue: Feign client not found
**Solution**: 
1. Ensure `@EnableFeignClients` is in main application class
2. Verify `spring-cloud-starter-openfeign` dependency in pom.xml
3. Check basePackages path in `@EnableFeignClients`

### Issue: Route conflict in Node.js
**Solution**: Ensure `/api/users/:id/validate` is defined BEFORE `/api/users/:id`

## Benefits of This Implementation

✅ **Data Integrity** - Orders cannot be created for non-existent users
✅ **Loose Coupling** - Services remain independent
✅ **Synchronous Validation** - Immediate feedback on user existence
✅ **Error Handling** - Graceful degradation if service unavailable
✅ **Scalable** - Easy to add more inter-service calls
✅ **Type-Safe** - Feign interfaces provide compile-time checks

## Next Steps

1. ✅ Add OpenFeign dependency
2. ✅ Create Feign client interface
3. ✅ Enable Feign clients in Spring Boot
4. ✅ Implement user validation in OrderService
5. ✅ Create validation endpoint in Node.js
6. 🔄 Test integration with real data
7. 🔄 Integrate with Eureka for service discovery
8. 🔄 Add circuit breaker for resilience
9. 🔄 Implement caching for performance

## Related Files

### Spring Boot (Restaurant Service)
- `pom.xml` - Dependencies
- `edukaApplication.java` - Enable Feign
- `UserClient.java` - Feign interface
- `UserDTO.java` - Data transfer object
- `OrderService.java` - User validation logic

### Node.js (User Service)
- `index.js` - Express app setup
- `routes/userRoutes.js` - Validation endpoint
- `models/User.js` - User schema

---

**Implementation Date**: Current Session
**Pattern**: Synchronous HTTP communication via OpenFeign
**Alternative**: RabbitMQ/Kafka (not chosen - too complex for simple validation)
