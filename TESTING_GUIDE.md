# 🧪 EdukaApp - Guide de Test Complet# 🚀 EdukaApp Restaurant Management - Complete Testing Guide



**Date:** 6 novembre 2025  ## ✅ All Components Created (8/8)

**Environnement:** Docker Compose Multi-Conteneurs

### BackOffice Components (3/3)

---- ✅ Restaurant Management

- ✅ Order Management  

## 📋 Services à Tester- ✅ User-Restaurant Assignment



| Service | Port | URL | Status Check |### FrontOffice Components (4/4)

|---------|------|-----|--------------|- ✅ Restaurant List

| **Keycloak** | 8080 | http://localhost:8080 | Admin Console |- ✅ Restaurant Details

| **Eureka Server** | 8761 | http://localhost:8761 | Dashboard |- ✅ Place Order

| **API Gateway** | 8888 | http://localhost:8888 | Health Check |- ✅ My Orders

| **Restaurant Service** | 8083 | http://localhost:8083 | Health Check |

| **Frontend Angular** | 4200 | http://localhost:4200 | Application Web |### Configuration

- ✅ Routing Updated

---- ✅ Services Ready (3/3)



## 🚀 Tests Rapides (Quick Tests)---



### 1️⃣ Test Keycloak (Authentication Server)## 📋 Step 1: Start Backend Services



```powershellOpen **4 separate PowerShell terminals** and run these commands in order:

# Test 1: Page d'accueil Keycloak

start http://localhost:8080### Terminal 1 - Eureka Server (Service Discovery)

```powershell

# Test 2: Admin Consolecd "c:\Users\saber\Desktop\5SE4\m s\EdukaApp-Springboot-Angular-Micro-services\infrastructure\eureka-server"

# Login: admin / adminmvn clean spring-boot:run

# Vérifier: Realm "Eduka-realm" existe```

✅ Wait for: "Eureka Server started" - http://localhost:8761

# Test 3: Vérifier le realm endpoint

curl http://localhost:8080/realms/Eduka-realm### Terminal 2 - Config Server (Centralized Configuration)

``````powershell

cd "c:\Users\saber\Desktop\5SE4\m s\EdukaApp-Springboot-Angular-Micro-services\infrastructure\config-server"

**✅ Résultat attendu:**mvn clean spring-boot:run

- Page Keycloak s'ouvre```

- Realm "Eduka-realm" visible dans la liste✅ Wait for: "Config Server started" - http://localhost:8888

- Endpoint retourne configuration JSON

### Terminal 3 - Restaurant Management Service

---```powershell

cd "c:\Users\saber\Desktop\5SE4\m s\EdukaApp-Springboot-Angular-Micro-services\microservices\restaurant-management-service"

### 2️⃣ Test Eureka Server (Service Discovery)mvn clean spring-boot:run

```

```powershell✅ Wait for: "Started RestaurantManagementServiceApplication" - http://localhost:8086

# Test 1: Dashboard Eureka

start http://localhost:8761### Terminal 4 - User Management Service (Node.js + MongoDB)

```powershell

# Test 2: Vérifier les services enregistréscd "c:\Users\saber\Desktop\5SE4\m s\EdukaApp-Springboot-Angular-Micro-services\user-management-nodejs"

curl http://localhost:8761/eureka/appsnpm install

```node index.js

```

**✅ Résultat attendu:**✅ Wait for: "User management service running on port 3000" - http://localhost:3000

- Dashboard Eureka s'ouvre✅ Wait for: "Started UserManagementServiceApplication" - http://localhost:8087

- Services enregistrés visibles:

  - RESTAURANT-MANAGEMENT-SERVICE---

  - API-GATEWAY

  - EUREKA-SERVER## 📋 Step 2: Start Frontend



---Open **Terminal 5** for Angular:



### 3️⃣ Test API Gateway (Port 8888)```powershell

cd "c:\Users\saber\Desktop\5SE4\m s\EdukaApp-Springboot-Angular-Micro-services\eduka-frontend"

```powershellnpm install

# Test 1: Health Checknpm start

curl http://localhost:8888/actuator/health```

✅ Wait for: "Compiled successfully" - http://localhost:4200

# Test 2: Gateway Info

curl http://localhost:8888/actuator/info---



# Test 3: Routes configurées## 🧪 Step 3: Test Backend APIs

curl http://localhost:8888/actuator/gateway/routes

```### Test Restaurant Service (Port 8086)



**✅ Résultat attendu:**```powershell

```json# Create a restaurant

{"status":"UP"}Invoke-RestMethod -Uri "http://localhost:8086/api/restaurants" -Method POST -ContentType "application/json" -Body '{

```  "name": "Campus Cafeteria",

  "address": "Building A, Floor 1",

---  "type": "Cafeteria",

  "description": "Main campus cafeteria",

### 4️⃣ Test Restaurant Service (Port 8083)  "phoneNumber": "+1234567890",

  "email": "cafeteria@eduka.com",

```powershell  "openingHours": "8:00 AM - 8:00 PM",

# Test 1: Health Check  "isActive": true

curl http://localhost:8083/actuator/health}'



# Test 2: Service Info# Get all restaurants

curl http://localhost:8083/actuator/infoInvoke-RestMethod -Uri "http://localhost:8086/api/restaurants" -Method GET

```

# Create menu items

**✅ Résultat attendu:**Invoke-RestMethod -Uri "http://localhost:8086/api/menu-items" -Method POST -ContentType "application/json" -Body '{

```json  "name": "Burger Deluxe",

{"status":"UP"}  "description": "Classic beef burger with fries",

```  "price": 12.99,

  "category": "Main Course",

---  "restaurant": 1,

  "isAvailable": true,

### 5️⃣ Test Frontend Angular  "preparationTime": 15

}'

```powershell

# Test 1: Ouvrir l'applicationInvoke-RestMethod -Uri "http://localhost:8086/api/menu-items" -Method POST -ContentType "application/json" -Body '{

start http://localhost:4200  "name": "Caesar Salad",

  "description": "Fresh romaine lettuce with Caesar dressing",

# Test 2: Vérifier que la page charge  "price": 8.99,

curl http://localhost:4200  "category": "Salad",

```  "restaurant": 1,

  "isAvailable": true,

**✅ Résultat attendu:**  "preparationTime": 10

- Application Angular charge}'

- Page d'accueil visible```

- Pas d'erreurs dans la console

### Test User Service (Port 8087)

---

```powershell

## 🔐 Tests avec Authentification Keycloak# Create a user

Invoke-RestMethod -Uri "http://localhost:8087/api/users" -Method POST -ContentType "application/json" -Body '{

### Étape 1: Obtenir un Token JWT  "firstName": "John",

  "lastName": "Doe",

```powershell  "email": "john.doe@eduka.com",

# Obtenir le client secret depuis Keycloak  "password": "password123",

# 1. Aller sur http://localhost:8080  "role": "STUDENT",

# 2. Login: admin/admin  "phoneNumber": "+1234567891"

# 3. Sélectionner "Eduka-realm"}'

# 4. Clients > api-gateway > Credentials > Copier le Secret

# Get all users

# Remplacer YOUR_CLIENT_SECRET par le vrai secretInvoke-RestMethod -Uri "http://localhost:8087/api/users" -Method GET

$response = Invoke-RestMethod -Uri "http://localhost:8080/realms/Eduka-realm/protocol/openid-connect/token" `

  -Method Post `# Assign user to restaurant

  -Body @{Invoke-RestMethod -Uri "http://localhost:8087/api/users/1/restaurants/1" -Method POST

    grant_type = "client_credentials"```

    client_id = "api-gateway"

    client_secret = "YOUR_CLIENT_SECRET"### Test Order Creation

  } `

  -ContentType "application/x-www-form-urlencoded"```powershell

# Create an order

$token = $response.access_tokenInvoke-RestMethod -Uri "http://localhost:8086/api/orders" -Method POST -ContentType "application/json" -Body '{

Write-Host "Token obtenu: $token"  "userId": 1,

```  "restaurantId": 1,

  "menuItemIds": [1, 2],

### Étape 2: Tester l'API des Restaurants via Gateway  "notes": "Extra sauce please",

  "deliveryAddress": "Dorm Room 205"

```powershell}'

# Test 1: Lister tous les restaurants (AVEC token)

curl -H "Authorization: Bearer $token" http://localhost:8888/api/restaurants# Get all orders

Invoke-RestMethod -Uri "http://localhost:8086/api/orders" -Method GET

# Test 2: Obtenir un restaurant spécifique

curl -H "Authorization: Bearer $token" http://localhost:8888/api/restaurants/1# Update order status

Invoke-RestMethod -Uri "http://localhost:8086/api/orders/1/status?status=CONFIRMED" -Method PATCH

# Test 3: Sans token (doit retourner 401)```

curl http://localhost:8888/api/restaurants

```---



**✅ Résultat attendu:**## 🌐 Step 4: Test Frontend Components

- Avec token: Liste des restaurants en JSON

- Sans token: 401 Unauthorized### BackOffice Components (Admin Interface)



---Navigate to: **http://localhost:4200/admin/1**



## 📊 Tests API Restaurant Service (Direct)#### 1. Restaurant Management

- URL: `http://localhost:4200/admin/1/restaurant-management`

### Test CRUD Restaurants- Test:

  - ✅ View all restaurants

```powershell  - ✅ Create new restaurant

# 1. Lister tous les restaurants  - ✅ Edit restaurant details

curl http://localhost:8083/api/restaurants  - ✅ Toggle restaurant status

  - ✅ Assign users to restaurant

# 2. Obtenir un restaurant par ID  - ✅ Delete restaurant

curl http://localhost:8083/api/restaurants/1

#### 2. Order Management

# 3. Créer un nouveau restaurant (POST)- URL: `http://localhost:4200/admin/1/order-management`

curl -X POST http://localhost:8083/api/restaurants `- Test:

  -H "Content-Type: application/json" `  - ✅ View dashboard statistics

  -d '{  - ✅ Filter orders by status

    "name": "Restaurant Test",  - ✅ Filter orders by restaurant

    "address": "123 Test Street",  - ✅ Update order status

    "phone": "123456789",  - ✅ View order details

    "email": "test@restaurant.com",  - ✅ Export orders to JSON

    "description": "Restaurant de test"

  }'#### 3. User-Restaurant Assignment

- URL: `http://localhost:4200/admin/1/user-restaurant-assignment`

# 4. Mettre à jour un restaurant (PUT)- Test:

curl -X PUT http://localhost:8083/api/restaurants/1 `  - ✅ View all users with assignments

  -H "Content-Type: application/json" `  - ✅ Filter by role

  -d '{  - ✅ Assign restaurant to user

    "name": "Restaurant Modifié",  - ✅ Unassign restaurant from user

    "address": "123 Test Street",  - ✅ Bulk assign users to restaurant

    "phone": "987654321",

    "email": "modified@restaurant.com",### FrontOffice Components (User Interface)

    "description": "Description modifiée"

  }'#### 1. Restaurant List

- URL: `http://localhost:4200/restaurants`

# 5. Supprimer un restaurant (DELETE)- Test:

curl -X DELETE http://localhost:8083/api/restaurants/33  - ✅ View all active restaurants

```  - ✅ Search restaurants

  - ✅ Filter by type

---  - ✅ Click to view details



## 🍔 Tests API Menu Items#### 2. Restaurant Details

- URL: `http://localhost:4200/restaurant/1`

```powershell- Test:

# 1. Lister tous les items d'un restaurant  - ✅ View restaurant info

curl http://localhost:8083/api/restaurants/1/menu-items  - ✅ Browse menu items

  - ✅ Filter by category

# 2. Créer un menu item  - ✅ Add items to cart

curl -X POST http://localhost:8083/api/restaurants/1/menu-items `  - ✅ Adjust quantities

  -H "Content-Type: application/json" `  - ✅ View cart total

  -d '{  - ✅ Proceed to checkout

    "name": "Pizza Margherita",

    "description": "Pizza classique",#### 3. Place Order

    "price": 12.99,- URL: `http://localhost:4200/place-order`

    "category": "PLAT",- Test:

    "available": true  - ✅ Review order summary

  }'  - ✅ Enter delivery address

  - ✅ Add special instructions

# 3. Obtenir un menu item  - ✅ Submit order

curl http://localhost:8083/api/menu-items/1

#### 4. My Orders

# 4. Mettre à jour un menu item- URL: `http://localhost:4200/my-orders`

curl -X PUT http://localhost:8083/api/menu-items/1 `- Test:

  -H "Content-Type: application/json" `  - ✅ View order history

  -d '{  - ✅ Filter by status

    "name": "Pizza Margherita XXL",  - ✅ View order details

    "description": "Grande pizza",  - ✅ Track order status

    "price": 15.99,

    "category": "PLAT",---

    "available": true

  }'## 🔍 Step 5: Database Verification



# 5. Supprimer un menu item### H2 Console Access

curl -X DELETE http://localhost:8083/api/menu-items/1

```**Restaurant Service Database:**

- URL: http://localhost:8086/h2-console

---- JDBC URL: `jdbc:h2:mem:restaurantdb`

- Username: `sa`

## 🧪 Tests Postman (Recommandé)- Password: (leave empty)



### Collection Postman à Créer**User Service Database:**

- URL: http://localhost:8087/h2-console

**1. Configuration de base:**- JDBC URL: `jdbc:h2:mem:userdb`

- Base URL: `http://localhost:8888` (via Gateway)- Username: `sa`

- Variable: `{{baseUrl}}`- Password: (leave empty)

- Token: `{{token}}`

### SQL Queries to Verify Data

**2. Requests à créer:**

```sql

#### Authentication-- Check restaurants

```SELECT * FROM RESTAURANT;

POST {{baseUrl}}/realms/Eduka-realm/protocol/openid-connect/token

Body (x-www-form-urlencoded):-- Check menu items

- grant_type: client_credentialsSELECT * FROM MENU_ITEM;

- client_id: api-gateway

- client_secret: YOUR_SECRET-- Check orders

SELECT * FROM ORDERS;

Tests:

pm.environment.set("token", pm.response.json().access_token);-- Check users

```SELECT * FROM USER;



#### Get All Restaurants-- Check user-restaurant assignments

```SELECT * FROM USER_ASSIGNED_RESTAURANT_IDS;

GET {{baseUrl}}/api/restaurants

Headers:-- Check order-menuitem relationships

- Authorization: Bearer {{token}}SELECT * FROM ORDER_MENU_ITEM_IDS;

``````



#### Get Restaurant by ID---

```

GET {{baseUrl}}/api/restaurants/1## 🎯 End-to-End Test Workflow

Headers:

- Authorization: Bearer {{token}}### Complete User Journey:

```

1. **Admin Creates Restaurant** (BackOffice)

#### Create Restaurant   - Go to: `/admin/1/restaurant-management`

```   - Create "Pizza Palace" restaurant

POST {{baseUrl}}/api/restaurants   - Add menu items: "Margherita Pizza" ($15), "Pepperoni Pizza" ($18)

Headers:

- Authorization: Bearer {{token}}2. **Admin Assigns Staff** (BackOffice)

- Content-Type: application/json   - Go to: `/admin/1/user-restaurant-assignment`

Body (raw JSON):   - Create user with STAFF role

{   - Assign user to "Pizza Palace"

  "name": "Nouveau Restaurant",

  "address": "123 Rue Example",3. **User Browses Restaurants** (FrontOffice)

  "phone": "123456789",   - Go to: `/restaurants`

  "email": "nouveau@restaurant.com",   - Search for "Pizza"

  "description": "Description du restaurant"   - Click "View Menu" on Pizza Palace

}

```4. **User Places Order** (FrontOffice)

   - On restaurant details page

---   - Add 2x Margherita Pizza to cart

   - Add 1x Pepperoni Pizza to cart

## 🔍 Vérification des Logs   - Click "Proceed to Checkout"

   - Enter delivery address

```powershell   - Submit order

# Voir tous les logs

docker-compose logs -f5. **Admin Manages Order** (BackOffice)

   - Go to: `/admin/1/order-management`

# Logs d'un service spécifique   - Find the new order

docker-compose logs -f restaurant-management-service   - Update status: PENDING → CONFIRMED → PREPARING → READY → DELIVERED → COMPLETED

docker-compose logs -f api-gateway

docker-compose logs -f eureka-server6. **User Tracks Order** (FrontOffice)

docker-compose logs -f keycloak   - Go to: `/my-orders`

   - View order details

# Logs des 100 dernières lignes   - See updated status

docker-compose logs --tail 100 restaurant-management-service

```---



---## 📊 Feature Checklist



## 🐛 Dépannage (Troubleshooting)### CRUD Operations

- ✅ Restaurant: Create, Read, Update, Delete

### Problème: Service ne répond pas- ✅ Menu Items: Create, Read, Update, Delete

- ✅ Orders: Create, Read, Update, Delete

```powershell- ✅ Users: Create, Read, Update, Delete

# Vérifier le statut

docker-compose ps### Relationships

- ✅ One-to-Many: Restaurant → Menu Items

# Vérifier les logs- ✅ One-to-Many: Restaurant → Orders

docker-compose logs [service-name]- ✅ Many-to-Many: User ↔ Restaurant (Assignments)

- ✅ Many-to-Many: Order ↔ Menu Items

# Redémarrer un service

docker-compose restart [service-name]### Business Logic

- ✅ Order total calculation

# Redémarrer tous les services- ✅ Order status workflow

docker-compose restart- ✅ Restaurant availability filtering

```- ✅ User assignment management

- ✅ Revenue calculation

### Problème: 401 Unauthorized

### UI Features

```- ✅ Search and filter

Cause: Token expiré ou invalide- ✅ Modal dialogs

Solution:- ✅ Shopping cart

1. Obtenir un nouveau token- ✅ Status badges

2. Vérifier le client secret dans Keycloak- ✅ Responsive tables

3. Vérifier que le realm "Eduka-realm" existe- ✅ Statistics dashboards

```- ✅ Data export



### Problème: 503 Service Unavailable---



```## 🐛 Troubleshooting

Cause: Service non enregistré dans Eureka

Solution:### Port Already in Use

1. Vérifier Eureka: http://localhost:8761```powershell

2. Attendre 30 secondes (registration delay)# Find process using port

3. Vérifier les logs du servicenetstat -ano | findstr :8086

```# Kill process

taskkill /PID <PID> /F

### Problème: Cannot connect to database```



```### Maven Build Fails

Cause: Volume ou configuration H2```powershell

Solution:mvn clean install -DskipTests

1. Vérifier les volumes: docker volume ls```

2. Vérifier les logs du service

3. Recréer les conteneurs: docker-compose down && docker-compose up -d### Angular Compile Errors

``````powershell

npm install

---ng build --configuration development

```

## ✅ Checklist de Test Complet

### CORS Errors

### Tests Infrastructure- Verify `@CrossOrigin(origins = "*")` on all controllers

- [ ] Keycloak accessible (http://localhost:8080)- Check browser console for details

- [ ] Eureka Dashboard accessible (http://localhost:8761)

- [ ] Services enregistrés dans Eureka### H2 Database Not Accessible

- [ ] Realm "Eduka-realm" importé dans Keycloak- Check `application.properties` has:

- [ ] Client "api-gateway" configuré  ```properties

  spring.h2.console.enabled=true

### Tests Gateway  spring.h2.console.path=/h2-console

- [ ] Gateway health check OK  ```

- [ ] Routes configurées visibles

- [ ] Authentication avec Keycloak fonctionne---

- [ ] Token JWT obtenu avec succès

## 📁 Project Structure

### Tests Restaurant Service

- [ ] Health check OK```

- [ ] GET /api/restaurants fonctionneeduka-frontend/src/app/

- [ ] GET /api/restaurants/{id} fonctionne├── BackOffice/

- [ ] POST /api/restaurants fonctionne│   ├── restaurant-management-back/      ✅ (3 files)

- [ ] PUT /api/restaurants/{id} fonctionne│   ├── order-management-back/           ✅ (3 files)

- [ ] DELETE /api/restaurants/{id} fonctionne│   └── user-restaurant-assignment/      ✅ (3 files)

├── FrontOffice/

### Tests Menu Items│   ├── restaurant-list/                 ✅ (3 files)

- [ ] GET /api/restaurants/{id}/menu-items fonctionne│   ├── restaurant-details/              ✅ (3 files)

- [ ] POST /api/restaurants/{id}/menu-items fonctionne│   ├── place-order/                     ✅ (3 files)

- [ ] PUT /api/menu-items/{id} fonctionne│   └── my-orders/                       ✅ (3 files)

- [ ] DELETE /api/menu-items/{id} fonctionne├── services/

│   ├── restaurant.service.ts            ✅

### Tests Frontend│   ├── order.service.ts                 ✅

- [ ] Application Angular charge│   └── user.service.ts                  ✅

- [ ] Page d'accueil visible└── app-routing.module.ts                ✅ Updated

- [ ] Navigation fonctionne```

- [ ] Appels API via proxy fonctionnent

**Total Files Created: 27**

---- TypeScript: 11 files

- HTML: 8 files

## 📝 Résultats de Test (Template)- CSS: 8 files



```markdown---

## Test Execution Report

Date: [DATE]## 🎉 Success Criteria

Tester: [NAME]

✅ All 4 backend services running

### Infrastructure Tests✅ Angular frontend compiled

- Keycloak: ✅ / ❌✅ All 8 components accessible

- Eureka: ✅ / ❌✅ Restaurant CRUD working

- Services Registered: ✅ / ❌✅ Order placement working

✅ User assignment working

### API Gateway Tests✅ Status updates working

- Health Check: ✅ / ❌✅ No console errors

- Authentication: ✅ / ❌

- Token Generation: ✅ / ❌---



### Restaurant Service Tests**Ready to test! Follow the steps above to verify everything works.** 🚀

- GET All: ✅ / ❌
- GET by ID: ✅ / ❌
- POST Create: ✅ / ❌
- PUT Update: ✅ / ❌
- DELETE: ✅ / ❌

### Notes:
[Add any observations or issues here]
```

---

## 🎯 Tests Automatisés (Bonus)

### Script PowerShell de Test

```powershell
# test-all-services.ps1

Write-Host "🧪 Testing EdukaApp Services..." -ForegroundColor Cyan

# Test Keycloak
Write-Host "`n1️⃣ Testing Keycloak..." -ForegroundColor Yellow
try {
    $keycloak = Invoke-WebRequest -Uri "http://localhost:8080" -UseBasicParsing
    Write-Host "✅ Keycloak: OK ($($keycloak.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Keycloak: FAILED" -ForegroundColor Red
}

# Test Eureka
Write-Host "`n2️⃣ Testing Eureka..." -ForegroundColor Yellow
try {
    $eureka = Invoke-RestMethod -Uri "http://localhost:8761/eureka/apps" -UseBasicParsing
    Write-Host "✅ Eureka: OK" -ForegroundColor Green
    Write-Host "   Registered Services: $($eureka.applications.application.Count)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Eureka: FAILED" -ForegroundColor Red
}

# Test Gateway Health
Write-Host "`n3️⃣ Testing API Gateway..." -ForegroundColor Yellow
try {
    $gateway = Invoke-RestMethod -Uri "http://localhost:8888/actuator/health"
    Write-Host "✅ Gateway: $($gateway.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Gateway: FAILED" -ForegroundColor Red
}

# Test Restaurant Service Health
Write-Host "`n4️⃣ Testing Restaurant Service..." -ForegroundColor Yellow
try {
    $restaurant = Invoke-RestMethod -Uri "http://localhost:8083/actuator/health"
    Write-Host "✅ Restaurant Service: $($restaurant.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Restaurant Service: FAILED" -ForegroundColor Red
}

# Test Frontend
Write-Host "`n5️⃣ Testing Frontend..." -ForegroundColor Yellow
try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:4200" -UseBasicParsing
    Write-Host "✅ Frontend: OK ($($frontend.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend: FAILED" -ForegroundColor Red
}

Write-Host "`n✅ Test Suite Complete!" -ForegroundColor Cyan
```

**Sauvegarder et exécuter:**
```powershell
.\test-all-services.ps1
```

---

**🎉 Bon testing! Tous les services sont prêts à être testés!**
