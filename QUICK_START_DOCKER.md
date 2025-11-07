# 🚀 QUICK START - EdukaApp with Docker

## 3 Commands to Run Everything:

```powershell
cd "C:\Users\saber\Desktop\5SE4\m s\EdukaApp-Springboot-Angular-Micro-services"
docker-compose up -d
docker-compose ps
```

## ✅ That's It! Your App is Running!

---

## 📱 Access Your Application:

### Main Application:
🎨 **Frontend:** http://localhost:4200

### Admin/Monitoring:
🔐 **Keycloak:** http://localhost:8080 (admin/admin)  
🔍 **Eureka:** http://localhost:8761  
🚪 **API Gateway:** http://localhost:8888  
🍽️ **Restaurant API:** http://localhost:8083

---

## 🛠️ Common Commands:

```powershell
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Check status
docker-compose ps

# Restart service
docker-compose restart restaurant-service-eduka
```

---

## 🐛 Troubleshooting:

### Services not starting?
```powershell
docker-compose logs
```

### Port already in use?
```powershell
netstat -ano | findstr ":8080 :8761 :8888 :8083 :4200"
```

### Need fresh start?
```powershell
docker-compose down -v
docker-compose up -d
```

---

## 📊 Architecture:

```
┌─────────────────────────────────────┐
│    http://localhost:4200            │
│    Angular Frontend (Nginx)         │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    http://localhost:8888            │
│    API Gateway (OAuth2 Secured)     │
└──────┬───────────────────┬──────────┘
       │                   │
┌──────▼─────┐      ┌──────▼──────────┐
│ Keycloak   │      │ Eureka Server   │
│ :8080      │      │ :8761           │
└────────────┘      └─────────────────┘
                           │
                    ┌──────▼──────────┐
                    │ Restaurant      │
                    │ Service :8083   │
                    └─────────────────┘
```

---

## ⏱️ Startup Time:

- **First time:** ~60 seconds (pulling images)
- **Subsequent:** ~30 seconds

---

## 💾 Data Persistence:

Your data is saved in Docker volumes:
- `restaurant-data` (H2 database)
- `keycloak-data` (OAuth config)

---

## 🎯 Next Steps:

1. Open http://localhost:4200
2. Test login functionality
3. Browse restaurants
4. Check Eureka dashboard
5. Monitor logs: `docker-compose logs -f`

---

**For detailed guide, see:** `HOW_TO_RUN_WITH_DOCKER.md`

**Happy Coding! 🎉**
