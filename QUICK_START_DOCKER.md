# 🚨 URGENT: Docker Desktop Not Running

## Current Problem

```
error during connect: open //./pipe/dockerDesktopLinuxEngine: 
The system cannot find the file specified.
```

**Status:** Docker Desktop Service is **STOPPED** ❌

---

## ✅ SOLUTION - Choose ONE Method:

### 🎯 **Method 1: Use PowerShell Script (RECOMMENDED)**

I've created an automated script for you.

**Steps:**

1. **Close this PowerShell window**

2. **Right-click PowerShell** → **"Run as Administrator"**

3. **Navigate to project:**
   ```powershell
   cd C:\Users\saber\Downloads\EdukaApp-Springboot-Angular-Micro-services-main\EdukaApp-Springboot-Angular-Micro-services-main
   ```

4. **Run the script:**
   ```powershell
   .\START_DOCKER.ps1
   ```

5. **Wait for:** "✅ Docker Desktop is ready to use!"

---

### 🖱️ **Method 2: Start Docker Desktop Manually (EASIEST)**

1. **Press `Windows Key`** (or click Start Menu)

2. **Type:** `Docker Desktop`

3. **Right-click** on "Docker Desktop"

4. **Select:** "Run as Administrator"

5. **Wait 30-60 seconds** until:
   - Docker whale icon appears in system tray (bottom-right)
   - Icon stops animating (becomes steady)
   - Hover over icon → says "Docker Desktop is running"

6. **Verify it's working:**
   ```powershell
   docker version
   docker ps
   ```
   Should work without errors!

---

### ⚙️ **Method 3: Start Service Manually**

1. **Press `Windows + R`**

2. **Type:** `services.msc` → Press Enter

3. **Find:** "Docker Desktop Service"

4. **Right-click** → **"Start"**

5. **Wait** for Status to show "Running"

6. **Also start Docker Desktop application** (see Method 2 step 1-4)

---

## 🧪 After Docker Starts - Test It

Run these commands:

```powershell
# Should show Client and Server versions
docker version

# Should show container list (even if empty)
docker ps

# Should show "Docker Desktop is running"
docker info
```

**All should work without "cannot connect" errors!**

---

## 🚀 Then Build Your Services

Once Docker is running:

```powershell
# Navigate to project (if not already there)
cd C:\Users\saber\Downloads\EdukaApp-Springboot-Angular-Micro-services-main\EdukaApp-Springboot-Angular-Micro-services-main

# Build admin-management-service with fixed Dockerfile
docker-compose build admin-management-service

# Start all services
docker-compose up
```

---

## ⚠️ If Docker Still Won't Start

### Issue: "Docker Desktop Service failed to start"

**Solution 1: Restart Windows**
```powershell
Restart-Computer
```
Then try Method 2 again.

**Solution 2: Reinstall Docker Desktop**

1. **Uninstall Docker Desktop:**
   - Settings → Apps → Docker Desktop → Uninstall

2. **Delete cache folders:**
   ```powershell
   Remove-Item -Recurse -Force "$env:APPDATA\Docker" -ErrorAction SilentlyContinue
   Remove-Item -Recurse -Force "$env:LOCALAPPDATA\Docker" -ErrorAction SilentlyContinue
   ```

3. **Download latest Docker Desktop:**
   - https://www.docker.com/products/docker-desktop

4. **Install as Administrator**

5. **Restart computer**

---

## 🔍 Why This Happened

The Docker Desktop background service (`com.docker.service`) is stopped. This service must be running for `docker` and `docker-compose` commands to work.

**Common causes:**
- Docker Desktop was closed/quit
- Windows Update or restart
- Service stopped due to inactivity
- System crash or forced shutdown

---

## 📋 Quick Checklist

Before running `docker-compose up`:

- [ ] Docker Desktop icon visible in system tray
- [ ] Docker icon is **NOT** animating (fully started)
- [ ] `docker version` shows both Client AND Server
- [ ] `docker ps` works without errors
- [ ] No "pipe" or "cannot connect" errors

---

## ✅ Your Configuration is Ready!

Once Docker Desktop starts, everything is configured:
- ✅ Keycloak integration enabled
- ✅ Dockerfile fixed (using eclipse-temurin images)
- ✅ docker-compose.yml updated
- ✅ All environment variables set

**Just need Docker Desktop to start!** 🚀

---

## 💡 Pro Tip

To prevent this in the future:

1. **Keep Docker Desktop running** when working with containers
2. **Don't quit Docker Desktop** - minimize it instead
3. **Set Docker Desktop to start on Windows startup:**
   - Docker Desktop → Settings → General
   - ✅ Check "Start Docker Desktop when you log in"

---

## 🆘 Still Need Help?

If none of these work:

1. **Check Windows Event Viewer:**
   - Press `Windows + R` → type `eventvwr.msc`
   - Go to: Windows Logs → Application
   - Look for Docker errors

2. **Check Docker Desktop Logs:**
   - Open Docker Desktop (even if not working)
   - Click bug icon → Troubleshoot → View logs

3. **Try WSL2 commands:**
   ```powershell
   wsl --list --verbose
   wsl --update
   wsl --shutdown
   ```
   Then restart Docker Desktop

---

**NEXT ACTION: Choose Method 1 or Method 2 above and start Docker Desktop!** 🎯
