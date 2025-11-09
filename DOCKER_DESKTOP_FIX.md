# Docker Desktop Fix Guide 🔧

## Problem Detected

You're getting this error:
```
error during connect: Head "http://%2F%2F.%2Fpipe%2FdockerDesktopLinuxEngine/_ping": 
open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified.
```

**This means:** Docker Desktop is not running properly or the Docker daemon is not accessible.

---

## ✅ Solution Steps

### Step 1: Restart Docker Desktop

1. **Close Docker Desktop completely:**
   - Right-click Docker icon in system tray (bottom-right corner)
   - Select "Quit Docker Desktop"
   - Wait 10 seconds

2. **Restart Docker Desktop:**
   - Press `Windows + S`
   - Type "Docker Desktop"
   - Click "Run as Administrator" (important!)

3. **Wait for Docker to fully start:**
   - Look for the Docker whale icon in the system tray
   - Icon should be steady (not animated)
   - Hover over it - should say "Docker Desktop is running"

### Step 2: Verify Docker is Running

Open PowerShell and run:

```powershell
# Check Docker version
docker version

# Check if daemon is responding
docker ps

# Check Docker info
docker info
```

**Expected output:**
- `docker version` should show both Client and Server versions
- `docker ps` should show a table (even if empty)
- No "cannot connect" errors

### Step 3: If Still Not Working - Check WSL2

Docker Desktop on Windows uses WSL2. Verify WSL2 is working:

```powershell
# Check WSL version
wsl --list --verbose

# Should show something like:
#   NAME                   STATE           VERSION
# * docker-desktop         Running         2
#   docker-desktop-data    Running         2
```

If WSL2 is not installed or not running:

```powershell
# Update WSL
wsl --update

# Set WSL2 as default
wsl --set-default-version 2
```

### Step 4: Restart Docker Service (Alternative)

If Docker Desktop won't start:

```powershell
# Run as Administrator
net stop com.docker.service
net start com.docker.service
```

Or restart the Windows services:
1. Press `Windows + R`
2. Type `services.msc`
3. Find "Docker Desktop Service"
4. Right-click → Restart

---

## 🚀 After Docker Desktop is Running

### Verify Your Services

```powershell
# Navigate to project directory
cd C:\Users\saber\Downloads\EdukaApp-Springboot-Angular-Micro-services-main\EdukaApp-Springboot-Angular-Micro-services-main

# Verify docker-compose can connect
docker-compose version

# Build admin-management-service
docker-compose build admin-management-service

# Start all services
docker-compose up
```

---

## 📋 Quick Checklist

Before running `docker-compose up`, verify:

- [ ] Docker Desktop icon is in system tray (bottom-right)
- [ ] Docker Desktop icon is NOT animated (fully started)
- [ ] `docker version` shows both Client and Server
- [ ] `docker ps` works without errors
- [ ] No other Docker-related errors in PowerShell

---

## 🐛 Common Issues

### Issue 1: "Docker Desktop is starting..." (stuck)

**Solution:**
1. Quit Docker Desktop
2. Delete these folders (if they exist):
   - `%APPDATA%\Docker\`
   - `%LOCALAPPDATA%\Docker\`
3. Restart Docker Desktop

### Issue 2: "WSL 2 installation is incomplete"

**Solution:**
```powershell
# Install WSL2 kernel update
wsl --update

# Restart computer
Restart-Computer
```

### Issue 3: "Hardware assisted virtualization not available"

**Solution:**
1. Restart computer
2. Enter BIOS (usually F2, F12, or Del during startup)
3. Enable "Virtualization Technology" or "VT-x"
4. Save and exit BIOS

### Issue 4: Port conflicts

If you see "port already allocated":

```powershell
# Find what's using port 8888 (API Gateway)
netstat -ano | findstr ":8888"

# Kill the process (replace PID with actual process ID)
Stop-Process -Id <PID> -Force

# Or check all ports used by docker-compose
netstat -ano | findstr ":8080"  # Keycloak
netstat -ano | findstr ":8761"  # Eureka
netstat -ano | findstr ":8087"  # Admin Service
```

---

## ✅ Dockerfile Fix Applied

I've updated the admin-management-service Dockerfile to use:
- **Build stage:** `maven:3.9-eclipse-temurin-17-alpine`
- **Runtime stage:** `eclipse-temurin:17-jre-alpine`

This matches the other services (eureka-server, api-gateway) and uses supported images.

**Changes made:**
- ✅ Replaced deprecated `openjdk:17-jdk-slim` → `eclipse-temurin:17-jre-alpine`
- ✅ Replaced `maven:3.8.5-openjdk-17` → `maven:3.9-eclipse-temurin-17-alpine`
- ✅ Added `wget` installation for healthchecks

---

## 🎯 Next Steps (After Docker Desktop Starts)

1. **Start Docker Desktop as Administrator**
2. **Wait for it to fully start** (icon steady in system tray)
3. **Run these commands:**

```powershell
# Clean up previous builds (optional)
docker-compose down -v

# Build all services from scratch
docker-compose build

# Start all services
docker-compose up
```

4. **Monitor startup logs:**
   - Watch for services to start in order
   - Keycloak → Eureka → User Management → Admin Management
   - Look for "Started" messages

5. **Verify services are running:**

```powershell
# Check running containers
docker ps

# Should see:
# - keycloak
# - eureka-server
# - api-gateway
# - user-management-nodejs
# - admin-management-service
# - mysqldb
# - mongodb
# - rabbitmq
# - config-server
# - notification-service
# - restaurant-management-service
# - eduka-frontend
```

6. **Access services:**
   - Keycloak: http://localhost:8080
   - Eureka: http://localhost:8761
   - API Gateway: http://localhost:8888
   - Admin Service: http://localhost:8087
   - Frontend: http://localhost:4200

---

## 📞 If You Still Have Issues

1. Check Docker Desktop logs:
   - Docker Desktop → Troubleshoot → View logs

2. Check Windows Event Viewer:
   - `eventvwr.msc` → Application logs → Docker

3. Reinstall Docker Desktop (last resort):
   - Uninstall Docker Desktop
   - Delete `%APPDATA%\Docker` and `%LOCALAPPDATA%\Docker`
   - Download latest from https://www.docker.com/products/docker-desktop
   - Install as Administrator

---

**Your configuration is ready! Just need Docker Desktop to start properly.** 🚀
