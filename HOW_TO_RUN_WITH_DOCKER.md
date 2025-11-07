# 🚀 How to Run EdukaApp with Docker

## 📋 Prerequisites

Before starting, make sure you have:
- ✅ Docker Desktop installed and running
- ✅ Docker Compose installed (comes with Docker Desktop)
- ✅ At least 4GB of free RAM
- ✅ Ports available: 8080, 8761, 8888, 8083, 4200

---

## 🎯 Quick Start (3 Commands)

```powershell
# 1. Navigate to project directory
cd "C:\Users\saber\Desktop\5SE4\m s\EdukaApp-Springboot-Angular-Micro-services"

# 2. Start all services
docker-compose up -d

# 3. Check status
docker-compose ps
```

**That's it! Your entire application is running!** 🎉

---

## 📊 Step-by-Step Guide

### **Step 1: Open PowerShell/Terminal**

```powershell
# Open PowerShell as Administrator (optional but recommended)
# Navigate to your project
cd "C:\Users\saber\Desktop\5SE4\m s\EdukaApp-Springboot-Angular-Micro-services"
```

---

### **Step 2: Start All Services**

```powershell
docker-compose up -d
```

**What happens:**
- Pulls/uses images from Docker Hub (saberbarhoumi11/*)
- Creates network `eduka-network`
- Starts 5 containers in order:
  1. Keycloak (OAuth2 server)
  2. Eureka Server (Service Discovery)
  3. Restaurant Service (Microservice)
  4. API Gateway (Secure proxy)
  5. Angular Frontend (UI)

**Expected output:**
```
[+] Running 6/6
 ✔ Network edukaapp-springboot-angular-micro-services_eduka-network  Created
 ✔ Container keycloak-eduka                                          Healthy
 ✔ Container eureka-server-eduka                                     Healthy
 ✔ Container restaurant-service-eduka                                Started
 ✔ Container api-gateway-eduka                                       Started
 ✔ Container eduka-frontend                                          Started
```

⏱️ **Time:** ~30-60 seconds for first startup

---

### **Step 3: Verify All Services Are Running**

```powershell
docker-compose ps
```

**Expected output:**
```
NAME                       STATUS
keycloak-eduka             Up (healthy)
eureka-server-eduka        Up (healthy)
restaurant-service-eduka   Up (healthy)
api-gateway-eduka          Up (healthy)
eduka-frontend             Up
```

All services should show **"Up"** status.

---

### **Step 4: Wait for Services to Be Ready**

Even after containers are "Up", services need time to initialize:

```powershell
# Wait 1-2 minutes, then check logs
docker-compose logs -f

# Or check specific service
docker-compose logs -f restaurant-service-eduka
```

**Look for these messages:**
- Keycloak: `"Keycloak 23.0.0 on JVM ... started"`
- Eureka: `"Started EurekaServerApplication"`
- Restaurant Service: `"Started RestaurantManagementServiceApplication"`
- API Gateway: `"Started ApiGatewayApplication"`

Press `Ctrl+C` to stop viewing logs.

---

## 🌐 Access Your Application

Once all services are running, open these URLs in your browser:

| Service | URL | Description |
|---------|-----|-------------|
| **🎨 Frontend** | http://localhost:4200 | Angular application (Main UI) |
| **🔐 Keycloak** | http://localhost:8080 | OAuth2 Admin Console (admin/admin) |
| **🔍 Eureka** | http://localhost:8761 | Service Discovery Dashboard |
| **🚪 API Gateway** | http://localhost:8888 | API Gateway (routes to microservices) |
| **🍽️ Restaurant API** | http://localhost:8083 | Restaurant Microservice |

---

## 🧪 Testing the Application

### **Test 1: Check Eureka Dashboard**

```powershell
start http://localhost:8761
```

**Expected:** You should see registered services:
- `RESTAURANT-MANAGEMENT-SERVICE`
- `API-GATEWAY` (might take a minute to appear)

---

### **Test 2: Check Keycloak**

```powershell
start http://localhost:8080
```

**Login:**
- Username: `admin`
- Password: `admin`

**Verify:**
- Realm "Eduka-realm" exists
- Client "api-gateway" is configured

---

### **Test 3: Test API Gateway Health**

```powershell
curl http://localhost:8888/actuator/health
```

**Expected response:**
```json
{"status":"UP"}
```

---

### **Test 4: Test Restaurant Service**

```powershell
# Health check
curl http://localhost:8083/actuator/health

# Get all restaurants (might need authentication)
curl http://localhost:8888/api/restaurants
```

---

### **Test 5: Open Frontend**

```powershell
start http://localhost:4200
```

**Expected:** Angular application loads with:
- Home page
- Login functionality
- Restaurant list (if not secured)

---

## 🔧 Common Commands

### **View Logs**

```powershell
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f restaurant-service-eduka
docker-compose logs -f api-gateway-eduka
docker-compose logs -f keycloak-eduka

# Last 50 lines
docker logs restaurant-service-eduka --tail 50
```

---

### **Restart Services**

```powershell
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart restaurant-service-eduka

# Restart after code changes (rebuild)
docker-compose up -d --build restaurant-service-eduka
```

---

### **Stop Services**

```powershell
# Stop all services (keeps data)
docker-compose stop

# Stop and remove containers (keeps volumes/data)
docker-compose down

# Stop and remove everything including volumes (CLEAN SLATE)
docker-compose down -v
```

---

### **Check Service Status**

```powershell
# Container status
docker-compose ps

# Detailed container info
docker ps -a

# Check resource usage
docker stats

# Check networks
docker network ls
```

---

## 🐛 Troubleshooting

### **Problem: Containers won't start**

```powershell
# Check if ports are already in use
netstat -ano | findstr ":8080 :8761 :8888 :8083 :4200"

# If ports are busy, stop the processes or change ports in docker-compose.yml
```

---

### **Problem: "Unhealthy" status**

```powershell
# Check logs for errors
docker-compose logs [service-name]

# Restart the unhealthy service
docker-compose restart [service-name]

# If still failing, check health check configuration
docker inspect [container-name] | findstr -i health
```

---

### **Problem: Service can't connect to Eureka**

```powershell
# Check Eureka is healthy
curl http://localhost:8761/actuator/health

# Check service logs for registration errors
docker-compose logs restaurant-service-eduka | Select-String "eureka"

# Verify network connectivity
docker exec restaurant-service-eduka ping eureka-server -c 3
```

---

### **Problem: Frontend shows 404 or connection errors**

```powershell
# Check API Gateway is running
curl http://localhost:8888/actuator/health

# Check frontend logs
docker-compose logs eduka-frontend

# Verify Nginx configuration
docker exec eduka-frontend cat /etc/nginx/nginx.conf
```

---

### **Problem: Database is empty**

```powershell
# Check if volume exists
docker volume ls | Select-String "restaurant-data"

# View H2 console (if enabled in application.properties)
start http://localhost:8083/h2-console

# JDBC URL: jdbc:h2:file:./data/restaurant_management_db
# Username: sa
# Password: (leave empty)
```

---

### **Problem: Out of memory**

```powershell
# Check memory usage
docker stats

# Increase Docker Desktop memory:
# Docker Desktop → Settings → Resources → Memory → Increase to 4GB+
```

---

## 🔄 Complete Restart (Fresh Start)

If you need to start completely fresh:

```powershell
# 1. Stop everything
docker-compose down -v

# 2. Remove all images (optional, will rebuild)
docker rmi saberbarhoumi11/eureka-server:1.0
docker rmi saberbarhoumi11/api-gateway:1.0
docker rmi saberbarhoumi11/restaurant-service:1.0
docker rmi saberbarhoumi11/frontend:1.0

# 3. Rebuild (if you made code changes)
docker-compose build

# 4. Start fresh
docker-compose up -d

# 5. Check status
docker-compose ps
```

---

## 📊 Monitoring

### **Real-time Logs**

```powershell
# Watch all logs
docker-compose logs -f

# Watch specific service with timestamps
docker-compose logs -f --timestamps restaurant-service-eduka
```

---

### **Resource Usage**

```powershell
# Real-time stats
docker stats

# Expected usage:
# - Each Java service: ~500-800MB RAM
# - Keycloak: ~400-600MB RAM
# - Frontend (Nginx): ~10-20MB RAM
# Total: ~2.5-3.5GB RAM
```

---

### **Health Checks**

```powershell
# Check all health statuses
docker-compose ps

# Detailed health info
docker inspect keycloak-eduka | Select-String -Pattern "Health" -Context 5
```

---

## 🎯 Development Workflow

### **Making Changes to Code**

```powershell
# 1. Make your code changes in the source files

# 2. Rebuild the specific service
docker-compose build restaurant-service-eduka

# 3. Restart with new image
docker-compose up -d restaurant-service-eduka

# 4. Check logs
docker-compose logs -f restaurant-service-eduka
```

---

### **Testing API Changes**

```powershell
# Use Postman or curl
curl -X GET http://localhost:8888/api/restaurants

# With authentication (if enabled)
# 1. Get token from Keycloak
$token = (curl -X POST http://localhost:8080/realms/Eduka-realm/protocol/openid-connect/token `
  -d "grant_type=client_credentials" `
  -d "client_id=api-gateway" `
  -d "client_secret=YOUR_SECRET" | ConvertFrom-Json).access_token

# 2. Use token in requests
curl -H "Authorization: Bearer $token" http://localhost:8888/api/restaurants
```

---

## 📦 Database Management

### **Access H2 Database**

```powershell
# Enter restaurant service container
docker exec -it restaurant-service-eduka sh

# Inside container:
ls -la /app/data/  # Check database file

# Exit
exit
```

---

### **Backup Database**

```powershell
# Copy database from container to local
docker cp restaurant-service-eduka:/app/data/restaurant_management_db.mv.db ./backup/

# Restore database
docker cp ./backup/restaurant_management_db.mv.db restaurant-service-eduka:/app/data/
```

---

## 🚀 Production Deployment

For deploying to production server:

```powershell
# 1. On your server, clone the repository
git clone https://github.com/saber-barhoumi/EdukaApp-Springboot-Angular-Micro-services.git
cd EdukaApp-Springboot-Angular-Micro-services

# 2. Use docker-compose-hub.yml (uses pre-built images)
docker-compose -f docker-compose-hub.yml up -d

# 3. Configure environment variables for production
# Edit docker-compose-hub.yml:
# - Change passwords
# - Configure proper hostnames
# - Use production Keycloak realm
# - Configure SSL/TLS

# 4. Monitor logs
docker-compose logs -f
```

---

## 📋 Quick Reference

### **Essential Commands**

| Command | Description |
|---------|-------------|
| `docker-compose up -d` | Start all services |
| `docker-compose down` | Stop all services |
| `docker-compose ps` | Check status |
| `docker-compose logs -f` | View logs |
| `docker-compose restart` | Restart all |
| `docker-compose build` | Rebuild images |
| `docker-compose pull` | Pull latest images |

---

### **URLs Quick Reference**

| Service | URL |
|---------|-----|
| Frontend | http://localhost:4200 |
| Keycloak | http://localhost:8080 |
| Eureka | http://localhost:8761 |
| Gateway | http://localhost:8888 |
| Restaurant | http://localhost:8083 |

---

## ✅ Verification Checklist

After starting services, verify:

- [ ] All containers show "Up" status: `docker-compose ps`
- [ ] Keycloak is accessible: http://localhost:8080
- [ ] Eureka shows registered services: http://localhost:8761
- [ ] API Gateway health is UP: http://localhost:8888/actuator/health
- [ ] Restaurant Service health is UP: http://localhost:8083/actuator/health
- [ ] Frontend loads: http://localhost:4200
- [ ] No errors in logs: `docker-compose logs`

---

## 🎉 Success!

If all checks pass, your EdukaApp is fully running with Docker! 🚀

**You now have:**
- ✅ 5 microservices running in containers
- ✅ Service discovery with Eureka
- ✅ Secure API Gateway with OAuth2
- ✅ Angular frontend with Nginx
- ✅ Persistent H2 database
- ✅ Complete observability with logs

---

## 📞 Need Help?

**Common Issues:**
1. Port conflicts → Change ports in `docker-compose.yml`
2. Memory issues → Increase Docker Desktop memory allocation
3. Services not connecting → Check Eureka dashboard
4. Authentication errors → Verify Keycloak realm configuration

**Check logs for detailed errors:**
```powershell
docker-compose logs [service-name]
```

---

**Happy Coding! 🎊**

**Date:** November 7, 2025  
**Project:** EdukaApp Multi-Container Application  
**Docker Hub:** https://hub.docker.com/u/saberbarhoumi11
