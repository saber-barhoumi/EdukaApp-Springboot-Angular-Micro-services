# 🚀 Quick Start Guide - Restaurant & User Management System

## Prerequisites
- Java 17 installed
- Maven 3.8+ installed
- Node.js 16+ and npm installed
- Angular CLI installed: `npm install -g @angular/cli`

---

## 🎯 Step 1: Start Backend Services

### Open 4 separate terminal windows:

**Terminal 1 - Eureka Server (Service Discovery)**
```bash
cd "c:\Users\saber\Desktop\5SE4\m s\EdukaApp-Springboot-Angular-Micro-services\infrastructure\eureka-server"
mvn spring-boot:run
```
Wait for: `Started EurekaServerApplication` message  
Access: http://localhost:8761

---

**Terminal 2 - Config Server**
```bash
cd "c:\Users\saber\Desktop\5SE4\m s\EdukaApp-Springboot-Angular-Micro-services\infrastructure\config-server"
mvn spring-boot:run
```
Wait for: `Started ConfigServerApplication` message  
Access: http://localhost:8888

---

**Terminal 3 - Restaurant Management Service**
```bash
cd "c:\Users\saber\Desktop\5SE4\m s\EdukaApp-Springboot-Angular-Micro-services\microservices\restaurant-management-service"
mvn spring-boot:run
```
Wait for: `Started edukaApplication` message  
Access: http://localhost:8086

---

**Terminal 4 - User Management Service**
```bash
cd "c:\Users\saber\Desktop\5SE4\m s\EdukaApp-Springboot-Angular-Micro-services\microservices\user-management-service"
mvn spring-boot:run
```
Wait for: `Started edukaApplication` message  
Access: http://localhost:8087

---

## 🎯 Step 2: Start Angular Frontend

**Terminal 5 - Angular Dev Server**
```bash
cd "c:\Users\saber\Desktop\5SE4\m s\EdukaApp-Springboot-Angular-Micro-services\eduka-frontend"
npm install  # Only first time
ng serve
```
Access: http://localhost:4200

---

## 🧪 Step 3: Test Backend APIs

### Using PowerShell:

**Test Restaurant API:**
```powershell
# Create a restaurant
Invoke-RestMethod -Uri "http://localhost:8086/api/restaurants" -Method Post -ContentType "application/json" -Body '{"name":"Campus Cafeteria","address":"Building A","type":"Cafeteria","description":"Main dining hall","phoneNumber":"123-456-7890","email":"cafe@uni.edu","isActive":true}'

# Get all restaurants
Invoke-RestMethod -Uri "http://localhost:8086/api/restaurants" -Method Get
```

**Test Menu Item API:**
```powershell
# Create menu item
Invoke-RestMethod -Uri "http://localhost:8086/api/menu-items?restaurantId=1" -Method Post -ContentType "application/json" -Body '{"name":"Cheeseburger","description":"Classic burger","price":8.99,"category":"Main Course","isAvailable":true,"preparationTime":15}'

# Get all menu items
Invoke-RestMethod -Uri "http://localhost:8086/api/menu-items" -Method Get
```

**Test Order API:**
```powershell
# Create order
Invoke-RestMethod -Uri "http://localhost:8086/api/orders" -Method Post -ContentType "application/json" -Body '{"userId":1,"restaurantId":1,"menuItemIds":[1],"notes":"Extra cheese","deliveryAddress":"Dorm 205"}'

# Get all orders
Invoke-RestMethod -Uri "http://localhost:8086/api/orders" -Method Get
```

**Test User API:**
```powershell
# Create user
Invoke-RestMethod -Uri "http://localhost:8087/api/users" -Method Post -ContentType "application/json" -Body '{"email":"student@uni.edu","password":"password","firstName":"John","lastName":"Doe","role":"STUDENT","isActive":true}'

# Get all users
Invoke-RestMethod -Uri "http://localhost:8087/api/users" -Method Get
```

---

## 📊 Step 4: Access Dashboards

### Eureka Dashboard
http://localhost:8761

**Should see:**
- RESTAURANT-MANAGEMENT-SERVICE
- USER-MANAGEMENT-SERVICE
- CONFIG-SERVER

### H2 Console (Restaurant Service)
http://localhost:8086/h2-console

**JDBC URL:** `jdbc:h2:mem:restaurantdb`  
**Username:** `sa`  
**Password:** *(leave empty)*

### H2 Console (User Service)
http://localhost:8087/h2-console

**JDBC URL:** `jdbc:h2:mem:userdb`  
**Username:** `sa`  
**Password:** *(leave empty)*

---

## 🎨 Step 5: Access Frontend

### Main Application
http://localhost:4200

### BackOffice (Admin)
http://localhost:4200/admin/1/menu-items

### FrontOffice (User)
http://localhost:4200/menu-items

---

## 🔥 Common Issues & Solutions

### Issue 1: Port Already in Use
**Error:** `Port 8086 is already in use`

**Solution:**
```powershell
# Find process using port
netstat -ano | findstr :8086

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Issue 2: Maven Build Fails
**Error:** `Cannot resolve dependencies`

**Solution:**
```bash
# Clean and rebuild
mvn clean install -U
```

### Issue 3: Angular Compilation Error
**Error:** `Cannot find module`

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue 4: CORS Error in Browser
**Error:** `Access to XMLHttpRequest blocked by CORS`

**Solution:**  
✅ Already fixed! All controllers have `@CrossOrigin(origins = "*")`

### Issue 5: Service Not Registering with Eureka
**Wait 30-60 seconds** - Services register after startup

---

## 📋 Verification Checklist

- [ ] Eureka Server running on port 8761
- [ ] Config Server running on port 8888
- [ ] Restaurant Service running on port 8086
- [ ] User Service running on port 8087
- [ ] All services visible in Eureka Dashboard
- [ ] Angular app running on port 4200
- [ ] Can create restaurant via API
- [ ] Can create menu item via API
- [ ] Can create order via API
- [ ] Can access H2 console
- [ ] Frontend loads without errors

---

## 🎓 Sample Test Workflow

### Complete End-to-End Test:

1. **Create Restaurant**
```powershell
$restaurant = Invoke-RestMethod -Uri "http://localhost:8086/api/restaurants" -Method Post -ContentType "application/json" -Body '{"name":"Pizza Corner","address":"Student Center","type":"Fast Food","isActive":true}'
Write-Host "Created Restaurant ID: $($restaurant.id)"
```

2. **Create Menu Items**
```powershell
$item1 = Invoke-RestMethod -Uri "http://localhost:8086/api/menu-items?restaurantId=$($restaurant.id)" -Method Post -ContentType "application/json" -Body '{"name":"Margherita Pizza","price":12.99,"category":"Main Course","isAvailable":true}'

$item2 = Invoke-RestMethod -Uri "http://localhost:8086/api/menu-items?restaurantId=$($restaurant.id)" -Method Post -ContentType "application/json" -Body '{"name":"Pepperoni Pizza","price":14.99,"category":"Main Course","isAvailable":true}'
```

3. **Create User**
```powershell
$user = Invoke-RestMethod -Uri "http://localhost:8087/api/users" -Method Post -ContentType "application/json" -Body '{"email":"john@uni.edu","password":"pass123","firstName":"John","lastName":"Doe","role":"STUDENT","isActive":true}'
```

4. **Assign User to Restaurant**
```powershell
Invoke-RestMethod -Uri "http://localhost:8087/api/users/$($user.id)/restaurants/$($restaurant.id)" -Method Post
```

5. **Create Order**
```powershell
$order = Invoke-RestMethod -Uri "http://localhost:8086/api/orders" -Method Post -ContentType "application/json" -Body "{`"userId`":$($user.id),`"restaurantId`":$($restaurant.id),`"menuItemIds`":[$($item1.id),$($item2.id)],`"notes`":`"Extra cheese`",`"deliveryAddress`":`"Dorm 205`"}"
Write-Host "Created Order ID: $($order.id) - Total: $$($order.totalAmount)"
```

6. **Update Order Status**
```powershell
Invoke-RestMethod -Uri "http://localhost:8086/api/orders/$($order.id)/status?status=CONFIRMED" -Method Patch
```

7. **Get User Orders**
```powershell
$userOrders = Invoke-RestMethod -Uri "http://localhost:8086/api/orders/user/$($user.id)" -Method Get
$userOrders | Format-Table
```

---

## 🎉 Success!

If all steps completed successfully, you now have:
- ✅ 5 running services
- ✅ Full microservices architecture
- ✅ Working REST APIs
- ✅ Database with sample data
- ✅ Angular frontend connected

**Next:** Create frontend components as described in IMPLEMENTATION_SUMMARY.md

---

## 📞 Need Help?

Check these files for detailed information:
- `BACKEND_IMPLEMENTATION.md` - Full backend documentation
- `IMPLEMENTATION_SUMMARY.md` - Complete implementation guide
- `infrastructure/config-server/README.md` - Config server details

Happy coding! 🚀
