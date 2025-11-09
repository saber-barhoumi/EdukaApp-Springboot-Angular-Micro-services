# Microservices Configuration - Admin Management Service

## Overview
The Admin Management Service is now fully configured as a microservice using:
- **Spring Cloud Netflix Eureka** - Service Discovery
- **Spring Cloud OpenFeign** - Inter-service Communication
- **Resilience4j** - Circuit Breaker Pattern
- **Spring Cloud LoadBalancer** - Client-side Load Balancing

## Architecture

```
┌─────────────────────┐
│  Eureka Server      │
│  (Port 8761)        │
└──────────┬──────────┘
           │ (Service Registration)
           │
    ┌──────┴───────────────────┐
    │                          │
┌───▼────────────────┐  ┌─────▼─────────────────┐
│ Admin Management   │  │ User Management       │
│ Service (8087)     │◄─┤ Service (3000)        │
│ Spring Boot + MySQL│  │ Node.js + MongoDB     │
└────────────────────┘  └───────────────────────┘
         │ (OpenFeign Client)
         └──────────────────────►
```

## Components Added

### 1. Dependencies (pom.xml)
```xml
<!-- OpenFeign for declarative REST clients -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>

<!-- LoadBalancer for client-side load balancing -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-loadbalancer</artifactId>
</dependency>

<!-- Resilience4j for circuit breaker pattern -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-circuitbreaker-resilience4j</artifactId>
</dependency>
```

### 2. Main Application Class
```java
@SpringBootApplication
@EnableDiscoveryClient  // Eureka client
@EnableFeignClients     // OpenFeign client
public class AdminManagementApplication {
    // ...
}
```

### 3. Feign Client Interface
**File**: `client/UserServiceClient.java`
- Communicates with User Management Service (Node.js)
- Methods:
  - `getUserById(String userId)` - Fetch user details
  - `validateUser(String userId)` - Validate user exists

### 4. Service Wrapper
**File**: `services/UserManagementService.java`
- Wraps Feign client with resilience patterns
- Implements circuit breaker and retry logic
- Provides fallback methods when user service is unavailable

### 5. Configuration Classes

#### UserServiceClientConfig.java
- Configures Feign client logging (FULL)
- Registers custom error decoder
- Sets up connection timeout handling

#### UserServiceErrorDecoder.java
- Custom error handling for user service responses
- Maps HTTP errors to domain exceptions:
  - 404 → `UserNotFoundException`
  - 401/403 → `UnauthorizedException`
  - 500+ → `UserServiceException`

### 6. Data Transfer Objects

#### UserDTO.java
- Represents user data from Node.js service
- Fields: id, username, email, firstName, lastName, role, isActive

## Configuration (application.properties)

```properties
# User Management Service URL
user.service.url=http://localhost:3000

# Feign Client Configuration
feign.client.config.default.connectTimeout=5000
feign.client.config.default.readTimeout=5000
feign.client.config.default.loggerLevel=FULL

# Circuit Breaker Configuration
resilience4j.circuitbreaker.instances.userService.slidingWindowSize=10
resilience4j.circuitbreaker.instances.userService.failureRateThreshold=50
resilience4j.circuitbreaker.instances.userService.waitDurationInOpenState=5000
resilience4j.circuitbreaker.instances.userService.permittedNumberOfCallsInHalfOpenState=3

# Retry Configuration
resilience4j.retry.instances.userService.maxAttempts=3
resilience4j.retry.instances.userService.waitDuration=1000
```

## How It Works

### Service Discovery
1. Admin Management Service registers with Eureka on startup
2. Eureka maintains a registry of all microservices
3. Services can discover each other via Eureka

### Inter-Service Communication
1. Controller receives request with userId
2. Service validates userId by calling `UserManagementService.validateUser(userId)`
3. `UserManagementService` uses `UserServiceClient` (Feign)
4. Feign makes HTTP GET request to Node.js service
5. Response is deserialized to `UserDTO`

### Circuit Breaker Pattern
```
Normal Operation:
Request → Circuit CLOSED → User Service → Response

After 50% Failures:
Request → Circuit OPEN → Fallback Method → Default Response

After Wait Period:
Request → Circuit HALF-OPEN → Test Request → Success/Failure
```

### Retry Logic
- Automatically retries failed requests 3 times
- Waits 1 second between retries
- Gives up after 3 failed attempts

## Usage Example

### In Academic Program Service
```java
@Service
public class AcademicProgramService {
    
    @Autowired
    private UserManagementService userManagementService;
    
    public AcademicProgramDTO createProgram(AcademicProgramDTO dto) {
        // Validate user exists
        Boolean isValid = userManagementService.validateUser(dto.getUserId());
        
        if (!isValid) {
            throw new IllegalArgumentException("Invalid user ID");
        }
        
        // Get user details
        UserDTO user = userManagementService.getUserById(dto.getUserId());
        log.info("Creating program for user: {}", user.getUsername());
        
        // Create program...
    }
}
```

## Testing the Setup

### 1. Start Services in Order
```bash
# 1. Start Eureka Server
cd infrastructure/eureka-server
mvn spring-boot:run

# 2. Start User Management Service
cd user-management-nodejs
npm start

# 3. Start Admin Management Service
cd microservices/admin-management-service
mvn spring-boot:run
```

### 2. Verify Service Registration
- Open Eureka Dashboard: http://localhost:8761
- Verify "ADMIN-MANAGEMENT-SERVICE" is registered

### 3. Test Feign Client
```bash
# Create academic program with userId
curl -X POST http://localhost:8087/api/academic-programs \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Computer Science",
    "code": "CS101",
    "userId": "64f1a2b3c4d5e6f7a8b9c0d1"
  }'
```

### 4. Check Logs
Look for Feign client logs:
```
[UserServiceClient#getUserById] ---> GET http://localhost:3000/api/users/64f1a2b3c4d5e6f7a8b9c0d1
[UserServiceClient#getUserById] <--- HTTP/1.1 200 (125ms)
```

### 5. Test Circuit Breaker
```bash
# Stop user service
# Make request to admin service
# Should use fallback method and log warning
```

## Troubleshooting

### Issue: Feign Client Not Found
**Solution**: Ensure `@EnableFeignClients` is present in main application class

### Issue: Connection Refused
**Solution**: Verify user service is running on port 3000

### Issue: Circuit Breaker Not Working
**Solution**: Check Resilience4j configuration in application.properties

### Issue: 404 Not Found
**Solution**: Ensure Node.js service has endpoints:
- GET /api/users/{id}
- GET /api/users/{id}/validate

## Next Steps

1. **Add Missing Endpoints to Node.js Service**:
   ```javascript
   // In user-management-nodejs/controllers/userController.js
   exports.getUserById = async (req, res) => {
       try {
           const user = await User.findById(req.params.id);
           if (!user) {
               return res.status(404).json({ message: 'User not found' });
           }
           res.json(user);
       } catch (error) {
           res.status(500).json({ message: error.message });
       }
   };
   ```

2. **Compile Maven Project**:
   ```bash
   mvn clean compile
   ```

3. **Restart Spring Boot Application**:
   - This will recreate database schema with userId NOT NULL
   - Initialize Feign clients
   - Register with Eureka

4. **Test Integration**:
   - Create academic program from frontend
   - Verify userId is validated against user service
   - Check logs for Feign client requests

## Additional Features to Consider

- **API Gateway**: Add Spring Cloud Gateway for routing
- **Distributed Tracing**: Add Sleuth + Zipkin for request tracing
- **Centralized Configuration**: Use Config Server for properties
- **Message Queue**: Add RabbitMQ/Kafka for async communication
- **Caching**: Add Redis to cache user validation results

## Resources

- [Spring Cloud OpenFeign](https://spring.io/projects/spring-cloud-openfeign)
- [Resilience4j Circuit Breaker](https://resilience4j.readme.io/docs/circuitbreaker)
- [Eureka Service Discovery](https://spring.io/projects/spring-cloud-netflix)
