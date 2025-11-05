# Restaurant & User Management Microservices - Backend Implementation

## Overview
Complete microservices implementation for Restaurant Management and User Management with all relationships and features.

## Architecture

### Microservices
1. **Restaurant Management Service** (Spring Boot - Port 8086)
2. **User Management Service** (Spring Boot - Port 8087)
3. **Eureka Server** (Service Discovery - Port 8761)
4. **API Gateway** (Port 8080)
5. **Config Server** (Port 8888)

---

## 1. Restaurant Management Service

### Entities & Relationships

#### Restaurant
- **Fields**: id, name, address, type, description, phoneNumber, email, openingHours, imageUrl, isActive
- **Relationships**:
  - One-to-Many: Restaurant → MenuItem
  - One-to-Many: Restaurant → Order
  - Many-to-Many: Restaurant ↔ User (assignedUserIds)

#### MenuItem
- **Fields**: id, name, description, price, category, imageUrl, isAvailable, preparationTime
- **Relationships**:
  - Many-to-One: MenuItem → Restaurant

#### Order
- **Fields**: id, userId, totalAmount, status, notes, deliveryAddress, createdAt, completedAt
- **Relationships**:
  - Many-to-One: Order → Restaurant
  - Many-to-Many: Order ↔ MenuItem
  - References User from User Management Service

#### OrderStatus (Enum)
- PENDING, CONFIRMED, PREPARING, READY, DELIVERED, COMPLETED, CANCELLED

### REST APIs

#### Restaurant Endpoints
```
POST   /api/restaurants                          - Create restaurant
PUT    /api/restaurants/{id}                     - Update restaurant
DELETE /api/restaurants/{id}                     - Delete restaurant
GET    /api/restaurants/{id}                     - Get restaurant
GET    /api/restaurants/{id}/menu                - Get restaurant with menu
GET    /api/restaurants                          - Get all restaurants
GET    /api/restaurants/active                   - Get active restaurants
GET    /api/restaurants/type/{type}              - Get restaurants by type
GET    /api/restaurants/search?name=             - Search restaurants
POST   /api/restaurants/{rid}/users/{uid}        - Assign user to restaurant
DELETE /api/restaurants/{rid}/users/{uid}        - Unassign user
GET    /api/restaurants/user/{userId}            - Get user's restaurants
```

#### MenuItem Endpoints
```
POST   /api/menu-items?restaurantId=             - Create menu item
PUT    /api/menu-items/{id}                      - Update menu item
DELETE /api/menu-items/{id}                      - Delete menu item
GET    /api/menu-items/{id}                      - Get menu item
GET    /api/menu-items                           - Get all menu items
GET    /api/menu-items/restaurant/{rid}          - Get restaurant menu items
GET    /api/menu-items/restaurant/{rid}/available - Get available items
GET    /api/menu-items/category/{category}      - Get items by category
GET    /api/menu-items/available                 - Get all available items
GET    /api/menu-items/search?name=              - Search menu items
```

#### Order Endpoints
```
POST   /api/orders                               - Create order
PUT    /api/orders/{id}                          - Update order
PATCH  /api/orders/{id}/status?status=           - Update order status
DELETE /api/orders/{id}                          - Delete order
GET    /api/orders/{id}                          - Get order
GET    /api/orders/{id}/details                  - Get order with items
GET    /api/orders                               - Get all orders
GET    /api/orders/user/{userId}                 - Get user orders
GET    /api/orders/restaurant/{rid}              - Get restaurant orders
GET    /api/orders/status/{status}               - Get orders by status
GET    /api/orders/user/{uid}/status/{status}    - Get user orders by status
GET    /api/orders/restaurant/{rid}/status/{s}   - Get restaurant orders by status
GET    /api/orders/date-range?startDate=&endDate= - Get orders by date range
GET    /api/orders/restaurant/{rid}/revenue      - Calculate revenue
POST   /api/orders/{oid}/items/{itemId}          - Add item to order
DELETE /api/orders/{oid}/items/{itemId}          - Remove item from order
```

---

## 2. User Management Service

### Entity

#### User
- **Fields**: id, email, password, firstName, lastName, username, phoneNumber, role, gender, age, isActive
- **Relationships**:
  - Many-to-Many: User ↔ Restaurant (assignedRestaurantIds)

### REST APIs

#### User Endpoints
```
POST   /api/users                                - Create user
PUT    /api/users/{id}                           - Update user
DELETE /api/users/{id}                           - Delete user
GET    /api/users/{id}                           - Get user
GET    /api/users                                - Get all users
GET    /api/users/active                         - Get active users
GET    /api/users/role/{role}                    - Get users by role
POST   /api/users/{uid}/restaurants/{rid}        - Assign restaurant
DELETE /api/users/{uid}/restaurants/{rid}        - Unassign restaurant
GET    /api/users/restaurant/{restaurantId}      - Get users by restaurant
```

---

## 3. Database Schema

### Restaurant Management DB (H2)

#### restaurants table
```sql
id, name, address, type, description, phone_number, email, 
opening_hours, image_url, is_active, created_at, updated_at
```

#### menu_items table
```sql
id, name, description, price, category, image_url, is_available,
preparation_time, restaurant_id, created_at, updated_at
```

#### orders table
```sql
id, user_id, restaurant_id, total_amount, status, notes,
delivery_address, created_at, updated_at, completed_at
```

#### order_menu_items (join table)
```sql
order_id, menu_item_id
```

#### restaurant_users (join table)
```sql
restaurant_id, user_id
```

### User Management DB (H2)

#### users table
```sql
id, email, password, first_name, last_name, username, phone_number,
role, gender, age, is_active, created_at, updated_at
```

#### user_restaurants (join table)
```sql
user_id, restaurant_id
```

---

## 4. How to Run

### Prerequisites
- Java 17
- Maven 3.8+
- Node.js 16+ (for Angular)

### Startup Order
1. **Eureka Server**
```bash
cd infrastructure/eureka-server
mvn spring-boot:run
# Access: http://localhost:8761
```

2. **Config Server**
```bash
cd infrastructure/config-server
mvn spring-boot:run
# Access: http://localhost:8888
```

3. **Restaurant Management Service**
```bash
cd microservices/restaurant-management-service
mvn spring-boot:run
# Access: http://localhost:8086
```

4. **User Management Service**
```bash
cd microservices/user-management-service
mvn spring-boot:run
# Access: http://localhost:8087
```

5. **API Gateway** (optional)
```bash
cd infrastructure/api-gateway
mvn spring-boot:run
# Access: http://localhost:8080
```

---

## 5. Testing Examples

### Create Restaurant
```bash
curl -X POST http://localhost:8086/api/restaurants \
-H "Content-Type: application/json" \
-d '{
  "name": "Campus Cafeteria",
  "address": "University Building A",
  "type": "Cafeteria",
  "description": "Student dining hall",
  "phoneNumber": "123-456-7890",
  "email": "cafeteria@university.edu"
}'
```

### Create Menu Item
```bash
curl -X POST "http://localhost:8086/api/menu-items?restaurantId=1" \
-H "Content-Type: application/json" \
-d '{
  "name": "Cheeseburger",
  "description": "Classic beef burger with cheese",
  "price": 8.99,
  "category": "Main Course",
  "isAvailable": true,
  "preparationTime": 15
}'
```

### Create Order
```bash
curl -X POST http://localhost:8086/api/orders \
-H "Content-Type: application/json" \
-d '{
  "userId": 1,
  "restaurantId": 1,
  "menuItemIds": [1, 2, 3],
  "notes": "Extra cheese",
  "deliveryAddress": "Dorm Room 205"
}'
```

### Assign User to Restaurant
```bash
curl -X POST http://localhost:8087/api/users/1/restaurants/1
```

---

## 6. Relationship Examples

### Many-to-Many: User ↔ Restaurant
```java
// User side
user.assignRestaurant(restaurantId);

// Restaurant side
restaurant.assignUser(userId);
```

### One-to-Many: Restaurant → MenuItem
```java
restaurant.addMenuItem(menuItem);
```

### Many-to-Many: Order ↔ MenuItem
```java
order.addItem(menuItem);
order.calculateTotal();
```

---

## 7. Next Steps for Frontend

### BackOffice Components (Admin/Super User)
Location: `eduka-frontend/src/app/BackOffice`

1. **restaurant-management-back** - CRUD for restaurants
2. **menu-items-back** - CRUD for menu items (already created)
3. **order-management-back** - View and manage orders
4. **user-restaurant-assignment** - Assign users to restaurants

### FrontOffice Components (Regular Users)
Location: `eduka-frontend/src/app/FrontOffice/pages-front`

1. **restaurant-list** - Browse all restaurants
2. **restaurant-details** - View restaurant and menu
3. **menu-items** - Display menu items (already created)
4. **place-order** - Create new orders
5. **my-orders** - View user order history

---

## 8. API Documentation

Full API documentation available at:
- Swagger UI: http://localhost:8086/swagger-ui.html (if enabled)
- H2 Console: http://localhost:8086/h2-console
- Eureka Dashboard: http://localhost:8761

---

## Summary

✅ Complete backend implementation
✅ All entities with proper relationships
✅ REST APIs for all CRUD operations
✅ Many-to-Many relationships implemented
✅ One-to-Many relationships implemented
✅ Cross-service communication ready
✅ Ready for frontend integration

**Total Endpoints Created**: 50+
**Services**: 2 microservices + 3 infrastructure services
**Entities**: 4 main entities (Restaurant, MenuItem, Order, User)
**Relationships**: 5 different relationship types implemented
