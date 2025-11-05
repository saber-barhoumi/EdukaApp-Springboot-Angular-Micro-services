# 🚀 Quick Start Guide - EdukaApp Services

## ⚡ Fast Start (3 Services)

### Terminal 1: User Management (Node.js + MongoDB)
```powershell
cd "c:\Users\saber\Desktop\5SE4\m s\EdukaApp-Springboot-Angular-Micro-services\user-management-nodejs"
node index.js
```
✅ **Expected**: `User management service running on port 3000`
🌐 **URL**: http://localhost:3000/api

---

### Terminal 2: Restaurant Management (Spring Boot + H2)
```powershell
cd "c:\Users\saber\Desktop\5SE4\m s\EdukaApp-Springboot-Angular-Micro-services\microservices\restaurant-management-service"
mvn spring-boot:run
```
✅ **Expected**: `Started RestaurantManagementServiceApplication`
🌐 **URL**: http://localhost:8086/api
💾 **H2 Console**: http://localhost:8086/h2-console

---

### Terminal 3: Angular Frontend
```powershell
cd "c:\Users\saber\Desktop\5SE4\m s\EdukaApp-Springboot-Angular-Micro-services\eduka-frontend"
npm start
```
✅ **Expected**: `Angular Live Development Server is listening on localhost:4200`
🌐 **URL**: http://localhost:4200

---

## 🔧 Prerequisites Check

### 1. MongoDB (Required for User Service)
```powershell
# Check if MongoDB is running
mongo --eval "db.runCommand({ping:1})"

# Start MongoDB (Windows)
net start MongoDB
```

### 2. Node.js & npm
```powershell
node --version  # Should be v14+
npm --version   # Should be v6+
```

### 3. Java & Maven
```powershell
java --version  # Should be 17+
mvn --version   # Should be 3.6+
```

---

## 📊 Service Status Check

### Check Running Services
```powershell
# Check all ports
netstat -ano | findstr ":3000 :8086 :4200"
```

Expected output:
```
TCP    0.0.0.0:3000     0.0.0.0:0     LISTENING    <PID>  # User Service
TCP    0.0.0.0:8086     0.0.0.0:0     LISTENING    <PID>  # Restaurant Service  
TCP    0.0.0.0:4200     0.0.0.0:0     LISTENING    <PID>  # Angular
```

---

## 🧪 Quick API Tests

### Test User Service (Port 3000)
```powershell
# Register a user
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method POST -ContentType "application/json" -Body '{
  "email": "test@example.com",
  "password": "password123",
  "firstName": "Test",
  "lastName": "User",
  "role": "STUDENT"
}'
```

### Test Restaurant Service (Port 8086)
```powershell
# Create a restaurant
Invoke-RestMethod -Uri "http://localhost:8086/api/restaurants" -Method POST -ContentType "application/json" -Body '{
  "name": "Campus Cafeteria",
  "type": "CAFETERIA",
  "description": "Main campus dining hall",
  "address": "123 University Ave",
  "phoneNumber": "+1234567890",
  "email": "cafeteria@uni.edu",
  "isActive": true
}'
```

---

## 🌐 Frontend URLs

### Public Access
- 🏠 **Home**: http://localhost:4200
- 📝 **Register**: http://localhost:4200/register
- 🔐 **Login**: http://localhost:4200/login
- 🍽️ **Restaurants**: http://localhost:4200/restaurants
- 📦 **My Orders**: http://localhost:4200/my-orders

### Admin Access (after login with admin role)
- 🏢 **Restaurant Management**: http://localhost:4200/admin/1/restaurant-management
- 📋 **Order Management**: http://localhost:4200/admin/1/order-management
- 👥 **User Assignment**: http://localhost:4200/admin/1/user-restaurant-assignment

---

## ⚠️ Troubleshooting

### Issue: "Cannot connect to MongoDB"
```powershell
# Start MongoDB
net start MongoDB

# Check status
sc query MongoDB
```

### Issue: "Port 3000 already in use"
```powershell
# Find process
netstat -ano | findstr :3000

# Kill process
taskkill /PID <PID> /F
```

### Issue: "Port 8086 already in use"
```powershell
# Find and kill Java process
Get-Process java | Stop-Process -Force
```

### Issue: "Angular compilation errors"
```powershell
# Clean and reinstall
cd eduka-frontend
Remove-Item node_modules -Recurse -Force
npm install
npm start
```

---

## 🛑 Stop All Services

### Stop Services
```powershell
# Stop Node.js (press Ctrl+C in User Service terminal)
# Stop Spring Boot (press Ctrl+C in Restaurant Service terminal)
# Stop Angular (press Ctrl+C in Frontend terminal)
```

### Force Stop All
```powershell
# Kill all processes
Get-Process node | Stop-Process -Force
Get-Process java | Stop-Process -Force
```

---

## 📝 Service Configuration Summary

| Service | Port | Technology | Database | Status |
|---------|------|------------|----------|--------|
| **User Management** | 3000 | Node.js + Express | MongoDB | ✅ Active |
| **Restaurant Mgmt** | 8086 | Spring Boot | H2 (in-memory) | ✅ Active |
| **Angular Frontend** | 4200 | Angular 17 | N/A | ✅ Active |
| **Eureka Server** | 8761 | Spring Boot | N/A | ⏸️ Optional |
| **Config Server** | 8888 | Spring Boot | N/A | ⏸️ Optional |

---

## 🎯 Development Workflow

1. **Start MongoDB** (if not already running)
2. **Terminal 1**: Start User Service (Node.js)
3. **Terminal 2**: Start Restaurant Service (Spring Boot)
4. **Terminal 3**: Start Angular Frontend
5. **Browser**: Open http://localhost:4200
6. **Test**: Register → Login → Browse Restaurants → Place Order

---

## 📚 Additional Documentation

- **User Service Details**: See `USER_SERVICE_UPDATE.md`
- **Full Testing Guide**: See `TESTING_GUIDE.md`
- **Component Documentation**: See `COMPONENT_PROGRESS.md`
- **Architecture Overview**: See `README.md`

---

## ✅ Success Checklist

- [ ] MongoDB is running
- [ ] User Service started on port 3000
- [ ] Restaurant Service started on port 8086
- [ ] Angular frontend started on port 4200
- [ ] Can access http://localhost:4200
- [ ] Can register a new user
- [ ] Can login successfully
- [ ] Can view restaurants list
- [ ] Can place an order

---

**Last Updated**: November 4, 2025
**Quick Start Version**: 2.0
