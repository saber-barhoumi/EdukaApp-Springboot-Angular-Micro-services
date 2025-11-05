# Config Server for EdukaApp Microservices

This is the centralized configuration server for the EdukaApp microservices architecture.

## Purpose

The Config Server provides centralized external configuration management for all microservices in the system. It eliminates the need to rebuild and redeploy services when configuration changes.

## Features

- ✅ Centralized configuration management
- ✅ Environment-specific configurations (dev, prod)
- ✅ Integration with Eureka for service discovery
- ✅ Native file system storage
- ✅ Spring Boot Actuator for health monitoring

## Configuration

### Server runs on port: `8888`

### Registered Services:
- **restaurant-management-service** (port: 8086)
- **user-management-service** (port: 8087)

## How to Run

```bash
cd infrastructure/config-server
mvn spring-boot:run
```

## Access Points

- Config Server: http://localhost:8888
- Eureka Dashboard: http://localhost:8761
- Health Check: http://localhost:8888/actuator/health

## Configuration Files

Configurations are stored in `src/main/resources/config/`:

- `restaurant-management-service.properties` - Development config
- `restaurant-management-service-prod.properties` - Production config
- `user-management-service.properties` - Development config
- `user-management-service-prod.properties` - Production config

## How Microservices Connect

Each microservice needs to add these dependencies:

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-config</artifactId>
</dependency>
```

And configure `bootstrap.properties`:

```properties
spring.application.name=restaurant-management-service
spring.cloud.config.uri=http://localhost:8888
spring.profiles.active=dev
```

## Architecture

```
Config Server (8888)
    ↓ provides config to
    ├── Restaurant Management Service (8086)
    ├── User Management Service (8087)
    └── Other Microservices...
    
All services register with Eureka (8761)
```

## Notes

- Config Server must start **before** microservices
- Eureka Server should also be running
- Use `prod` profile for production environments
