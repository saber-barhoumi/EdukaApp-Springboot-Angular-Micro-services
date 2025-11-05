# Frontend Integration Guide - Restaurant Management Services

## Overview
This document describes the integration of Restaurant Management microservice (Spring Boot - port 8083) with the Angular frontend (eduka-frontend). The services are now properly consumed in both BackOffice and FrontOffice sections.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Angular Frontend (4200)                    │
│                                                              │
│  ┌────────────────────┐      ┌──────────────────────────┐  │
│  │   FrontOffice      │      │     BackOffice           │  │
│  │  (Students/Users)  │      │  (Admins/SuperUsers)     │  │
│  │                    │      │                          │  │
│  │ - restaurant-list  │      │ - restaurant-mgmt-back   │  │
│  │ - restaurant-      │      │ - menu-items-back        │  │
│  │   details          │      │ - order-mgmt-back        │  │
│  │ - place-order      │      │ - user-assignment        │  │
│  └────────────────────┘      └──────────────────────────┘  │
│            │                            │                    │
│            └────────────┬───────────────┘                    │
│                         │                                    │
│                         ▼                                    │
│         ┌───────────────────────────────┐                   │
│         │   Angular Services Layer      │                   │
│         │ - RestaurantService           │                   │
│         │ - MenuItemService (NEW)       │                   │
│         │ - OrderService                │                   │
│         │ - AuthService                 │                   │
│         └───────────────────────────────┘                   │
│                         │                                    │
└─────────────────────────┼────────────────────────────────────┘
                          │
                          │ HTTP/Proxy (/api → localhost:8083)
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│      Restaurant Management Service (Spring Boot - 8083)     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Restaurant   │  │ MenuItem     │  │ Order        │     │
│  │ Service      │  │ Service      │  │ Service      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                  │                  │             │
│         └──────────────────┴──────────────────┘             │
│                            │                                │
│                            ▼                                │
│                   PostgreSQL Database                       │
└─────────────────────────────────────────────────────────────┘
```

## Changes Made

### 1. Configuration Updates

#### Environment Configuration (environment.ts)
```typescript
apiUrl: '/api',  // Changed from 'http://localhost:8086/api' to use proxy
services: {
  restaurant: '/api'  // Use proxy
}
```

#### Proxy Configuration (proxy.conf.json)
```json
{
  "/api": {
    "target": "http://localhost:8083",  // Changed from 8086 to 8083
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

### 2. New Services Created

#### MenuItemService (NEW)
**Location**: `src/app/services/menu-item.service.ts`

**Purpose**: Dedicated service for menu item operations

**Key Methods**:
- `createMenuItem(menuItem)` - Create new menu item
- `updateMenuItem(id, menuItem)` - Update existing item
- `deleteMenuItem(id)` - Delete menu item
- `getMenuItem(id)` - Get single item
- `getAllMenuItems()` - Get all items
- `getMenuItemsByRestaurant(restaurantId)` - Get items by restaurant
- `getAvailableMenuItems(restaurantId)` - Get available items only
- `getMenuItemsByCategory(category)` - Filter by category
- `searchMenuItems(name)` - Search by name
- `toggleAvailability(id)` - Toggle item availability

**Interface**:
```typescript
interface MenuItem {
  id?: number;
  name: string;
  description?: string;
  price: number;
  category?: string;
  imageUrl?: string;
  isAvailable?: boolean;
  preparationTime?: number;
  restaurantId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
```

### 3. Updated Services

#### RestaurantService
Already existed, now properly uses proxy configuration.

#### OrderService
Already existed, updated to use proper OrderStatus enum and removed duplicate MenuItem methods (moved to MenuItemService).

### 4. BackOffice Components

#### menu-items-back Component
**Updated**: Complete rewrite with BackOffice template integration

**Features**:
- ✅ Full CRUD operations for menu items
- ✅ Filter by restaurant, category, availability
- ✅ Search functionality
- ✅ Toggle availability status
- ✅ Form validation
- ✅ Uses BackOffice template CSS/JS
- ✅ Consumes MenuItemService

**Template Highlights**:
- Uses Edmin template cards and tables
- Breadcrumb navigation
- Bootstrap form controls
- Status badges (Available/Unavailable)
- Icon buttons for actions

#### restaurant-management-back Component
**Updated**: Integrated OrderService for real order management

**Changes**:
- ✅ Removed mock data generation
- ✅ Now uses `orderService.getAllOrders()`
- ✅ Real-time order status updates via API
- ✅ View order details with items
- ✅ Proper error handling
- ✅ Uses OrderStatus enum

**Features**:
- Three tabs: Restaurants, Orders, User Assignments
- Real order statistics
- Filter orders by status/restaurant
- Update order status
- View full order details with menu items

### 5. FrontOffice Components

#### restaurant-list Component
**Status**: Already working correctly

**Features**:
- ✅ Loads active restaurants via RestaurantService
- ✅ Search and filter functionality
- ✅ Owl Carousel integration
- ✅ Uses FrontOffice template styles

#### restaurant-details Component
**Updated**: Now uses MenuItemService instead of OrderService for menu items

**Changes**:
- ✅ Imports MenuItemService
- ✅ Uses `menuItemService.getAvailableMenuItems()`
- ✅ Shopping cart functionality
- ✅ Filter by category
- ✅ Add/remove items from cart

**Features**:
- Display restaurant details
- Show available menu items
- Category filtering
- Shopping cart with quantity management
- Proceed to checkout

#### place-order Component
**Updated**: Integrated with AuthService for user validation

**Changes**:
- ✅ Gets userId from AuthService
- ✅ Validates user is logged in
- ✅ Prevents double submission
- ✅ Better error handling
- ✅ Shows specific error messages (including OpenFeign validation errors)

**Features**:
- Review cart items
- Enter delivery address and notes
- Submit order with user validation
- Redirect to login if not authenticated
- Handle order creation errors gracefully

## API Endpoints Used

### Restaurant Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/restaurants` | Get all restaurants |
| GET | `/api/restaurants/{id}` | Get restaurant by ID |
| GET | `/api/restaurants/active` | Get active restaurants |
| POST | `/api/restaurants` | Create restaurant |
| PUT | `/api/restaurants/{id}` | Update restaurant |
| DELETE | `/api/restaurants/{id}` | Delete restaurant |

### Menu Item Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/menu-items` | Get all menu items |
| GET | `/api/menu-items/{id}` | Get menu item by ID |
| GET | `/api/menu-items/restaurant/{id}` | Get items by restaurant |
| GET | `/api/menu-items/restaurant/{id}/available` | Get available items |
| POST | `/api/menu-items` | Create menu item |
| PUT | `/api/menu-items/{id}` | Update menu item |
| DELETE | `/api/menu-items/{id}` | Delete menu item |
| PATCH | `/api/menu-items/{id}/toggle-availability` | Toggle availability |

### Order Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | Get all orders |
| GET | `/api/orders/{id}` | Get order by ID |
| GET | `/api/orders/{id}/details` | Get order with items |
| GET | `/api/orders/user/{userId}` | Get orders by user |
| GET | `/api/orders/restaurant/{restaurantId}` | Get orders by restaurant |
| POST | `/api/orders` | Create order (validates user via OpenFeign) |
| PUT | `/api/orders/{id}` | Update order |
| PATCH | `/api/orders/{id}/status` | Update order status |
| DELETE | `/api/orders/{id}` | Delete order |

## User Validation Flow (OpenFeign Integration)

When a user places an order:

```
1. User fills out order form in place-order component
   ↓
2. Gets userId from AuthService (must be logged in)
   ↓
3. Submits order via OrderService.createOrder()
   ↓
4. Frontend → Restaurant Service (POST /api/orders)
   ↓
5. OrderService.createOrder() validates user
   ↓
6. OpenFeign UserClient calls User Service (GET /api/users/{id}/validate)
   ↓
7. User Service (Node.js) checks MongoDB
   ↓
8. Returns true/false
   ↓
9. If false → Exception "User not found with id: X"
   If true → Create order and save to database
   ↓
10. Response sent back to frontend
    ↓
11. Success: Show confirmation, clear cart
    Error: Show error message (e.g., "User not found")
```

## Testing the Integration

### Prerequisites
1. ✅ PostgreSQL running (for Restaurant service)
2. ✅ MongoDB running (for User service)
3. ✅ Node.js User Management service running (port 3000)
4. ✅ Restaurant Management service running (port 8083)
5. ✅ Angular dev server running with proxy (port 4200)

### Start Services

#### 1. Start User Management Service (Node.js)
```bash
cd user-management-nodejs
npm install
node index.js
```
Expected: `User management service running on port 3000`

#### 2. Start Restaurant Management Service (Spring Boot)
```bash
cd microservices/restaurant-management-service
mvn spring-boot:run
```
Expected: Service starts on port 8083

#### 3. Start Angular Frontend
```bash
cd eduka-frontend
npm install
npm start
# or
ng serve --proxy-config proxy.conf.json
```
Expected: Application running on port 4200

### Test Scenarios

#### BackOffice Testing (Admin)

**Test 1: Menu Items Management**
1. Navigate to `/admin/1/menu-items`
2. Select a restaurant from dropdown
3. Add new menu item with all fields
4. Verify item appears in table
5. Edit item and update price
6. Toggle availability status
7. Filter by category
8. Search by name
9. Delete item

**Expected Results**:
- ✅ All CRUD operations work
- ✅ Filters apply correctly
- ✅ Status badge updates (Available/Unavailable)
- ✅ Restaurant name displays in table

**Test 2: Order Management**
1. Navigate to `/admin/1/restaurant-management`
2. Click "Orders" tab
3. View order statistics (Total, Revenue, Pending, Completed)
4. Filter by restaurant/status
5. Change order status via dropdown
6. Click "View Details" to see order with items

**Expected Results**:
- ✅ Real orders load from database
- ✅ Statistics calculate correctly
- ✅ Status updates via API
- ✅ Order details show menu items

#### FrontOffice Testing (Student/User)

**Test 3: Browse Restaurants**
1. Navigate to `/restaurants`
2. View restaurant carousel
3. Search for restaurant by name
4. Filter by type (Cafeteria, Fast Food, etc.)
5. Click "View Details" on a restaurant

**Expected Results**:
- ✅ Only active restaurants shown
- ✅ Owl Carousel works with dynamic data
- ✅ Search filters restaurants
- ✅ Navigation to details works

**Test 4: Order Placement**
1. On restaurant details page, browse menu items
2. Filter by category
3. Add items to cart (multiple quantities)
4. View cart summary
5. Click "Proceed to Checkout"
6. Enter delivery address
7. Add notes (optional)
8. Click "Place Order"

**Expected Results**:
- ✅ Menu items load by restaurant
- ✅ Cart updates with quantities
- ✅ Total calculates correctly
- ✅ Order submits successfully
- ✅ User validation works (must be logged in)
- ✅ Success message shows with order ID

**Test 5: User Validation (OpenFeign)**
1. Ensure you're logged in with valid user
2. Add items to cart and checkout
3. Submit order

**Expected**: Order created successfully ✅

4. Logout or use invalid userId
5. Try to place order

**Expected**: Error "User not found" or redirect to login ❌

## Error Handling

### Common Errors and Solutions

#### Error: "Connection refused" or 404
**Cause**: Backend service not running
**Solution**: 
```bash
cd microservices/restaurant-management-service
mvn spring-boot:run
```

#### Error: "User not found with id: X"
**Cause**: OpenFeign validation failed - user doesn't exist in MongoDB
**Solution**: 
1. Check User Management service is running
2. Verify user exists: `GET http://localhost:3000/api/auth/debug-users`
3. Ensure userId in frontend matches MongoDB user ID

#### Error: "CORS policy" or "No 'Access-Control-Allow-Origin'"
**Cause**: Proxy not configured or Angular not started with proxy
**Solution**:
```bash
ng serve --proxy-config proxy.conf.json
```

#### Error: Menu items not loading
**Cause**: Wrong API URL or restaurant service down
**Solution**:
1. Check proxy config points to port 8083
2. Verify service is running
3. Check browser console for API errors

## Benefits of This Integration

✅ **Type Safety** - TypeScript interfaces for all data models
✅ **Service Layer** - Centralized API calls in Angular services
✅ **Separation of Concerns** - Dedicated service for each entity (Restaurant, MenuItem, Order)
✅ **Error Handling** - Proper try-catch and error messages
✅ **User Validation** - OpenFeign integration prevents invalid orders
✅ **Template Consistency** - BackOffice uses Edmin template, FrontOffice uses existing styles
✅ **Reusability** - Services can be injected into any component
✅ **Maintainability** - Easy to update API endpoints in one place

## Next Steps

### Recommended Enhancements

1. **Add Loading Indicators**
   - Show spinners during API calls
   - Disable buttons while submitting

2. **Implement Pagination**
   - For menu items list
   - For orders list

3. **Add Image Upload**
   - For restaurant images
   - For menu item images
   - Use file upload service or Cloudinary

4. **Improve Order Tracking**
   - Real-time status updates (WebSocket)
   - Order history page
   - Print receipt functionality

5. **Enhanced Filtering**
   - Date range for orders
   - Price range for menu items
   - Multi-select categories

6. **Notifications**
   - Toast messages instead of alerts
   - Email notifications for orders
   - Push notifications

7. **Analytics Dashboard**
   - Revenue charts
   - Popular items
   - Order trends

8. **Mobile Responsiveness**
   - Optimize for mobile devices
   - Touch-friendly UI

## Related Files

### Angular Frontend
- **Services**: 
  - `src/app/services/restaurant.service.ts`
  - `src/app/services/menu-item.service.ts` (NEW)
  - `src/app/services/order.service.ts`
  - `src/app/services/auth-simple.service.ts`

- **BackOffice Components**:
  - `src/app/BackOffice/menu-items-back/` (UPDATED)
  - `src/app/BackOffice/restaurant-management-back/` (UPDATED)

- **FrontOffice Components**:
  - `src/app/FrontOffice/restaurant-list/` (Working)
  - `src/app/FrontOffice/restaurant-details/` (UPDATED)
  - `src/app/FrontOffice/place-order/` (UPDATED)

- **Configuration**:
  - `src/environments/environment.ts` (UPDATED)
  - `proxy.conf.json` (UPDATED)

### Spring Boot Backend
- **Services**: 
  - `microservices/restaurant-management-service/src/main/java/com/eduka/restaurant/service/RestaurantService.java`
  - `microservices/restaurant-management-service/src/main/java/com/eduka/restaurant/service/MenuItemService.java`
  - `microservices/restaurant-management-service/src/main/java/com/eduka/restaurant/service/OrderService.java`

- **OpenFeign**:
  - `microservices/restaurant-management-service/src/main/java/com/eduka/restaurant/client/UserClient.java`
  - `microservices/restaurant-management-service/src/main/java/com/eduka/restaurant/dto/UserDTO.java`

---

**Implementation Date**: Current Session
**Frontend Framework**: Angular 17
**Backend Framework**: Spring Boot 3.1.5
**Database**: PostgreSQL (Restaurant), MongoDB (Users)
**Proxy**: Angular dev server proxy to port 8083
**Authentication**: JWT via AuthService
**User Validation**: OpenFeign synchronous calls
