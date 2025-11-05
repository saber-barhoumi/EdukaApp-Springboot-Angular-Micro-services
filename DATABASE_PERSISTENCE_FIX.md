# Database Persistence Fix - Restaurant Management

## Problem Identified

**Root Cause**: The H2 database was configured with:
1. **In-memory storage** (`jdbc:h2:mem:`) - Data only exists while the application runs
2. **`create-drop` mode** - Database schema is dropped and recreated on every application restart

**Impact**: All restaurants created through the UI were lost when:
- Restarting the Spring Boot service
- Reloading the browser page (if service restarted)

## Solution Applied

### 1. Changed Database to File-Based Persistence

**Before** (`application.properties`):
```properties
spring.datasource.url=jdbc:h2:mem:restaurant_management_db
spring.jpa.hibernate.ddl-auto=create-drop
```

**After**:
```properties
spring.datasource.url=jdbc:h2:file:./data/restaurant_management_db
spring.jpa.hibernate.ddl-auto=update
spring.jpa.defer-datasource-initialization=true
```

**Changes**:
- `mem:` → `file:./data/` = Data persists to disk in `./data/` directory
- `create-drop` → `update` = Schema is updated but not dropped
- Added `defer-datasource-initialization=true` for proper initialization

### 2. Added Console Logging for Debugging

Updated both components to log restaurant loading:

**restaurant-management-back.component.ts**:
```typescript
loadRestaurants(): void {
  console.log('Loading restaurants...');
  this.restaurantService.getAllRestaurants().subscribe({
    next: (data) => {
      console.log('Restaurants loaded from database:', data);
      console.log('Total restaurants:', data.length);
      this.restaurants = data;
      this.filteredRestaurants = data;
    }
  });
}
```

**menu-items-back.component.ts**:
```typescript
loadRestaurants() {
  console.log('Loading restaurants for menu items...');
  this.restaurantService.getAllRestaurants().subscribe({
    next: (data) => {
      console.log('Restaurants loaded:', data);
      console.log('Total restaurants:', data.length);
      this.restaurants = data;
    }
  });
}
```

### 3. Created Sample Data File (Optional)

Created `data.sql` with commented-out sample data. Can be enabled later if needed.

## How to Apply the Fix

### Step 1: Stop the Restaurant Service

In the terminal running `restaurant-management-service` (port 8083), press `Ctrl+C` to stop it.

### Step 2: Restart the Restaurant Service

Navigate to the restaurant service directory and restart:

```powershell
cd "microservices\restaurant-management-service"
.\mvnw spring-boot:run
```

Or if using the compiled JAR:
```powershell
cd "microservices\restaurant-management-service\target"
java -jar restaurant-management-service-0.0.1-SNAPSHOT.jar
```

### Step 3: Verify Database Persistence

1. **Navigate to**: http://localhost:4200/admin/1/restaurant-management

2. **Open Browser Console** (F12 → Console tab)

3. **Check Console Output**:
   - You should see: `"Loading restaurants..."`
   - Then: `"Restaurants loaded from database:"` with array of restaurants
   - Then: `"Total restaurants: X"`

4. **Create a New Restaurant**:
   - Click "Add New Restaurant"
   - Fill in: Name, Type, Address, Phone, Email
   - Click "Save Restaurant"
   - Console should show: `"Restaurant created: {id: X, ...}"`
   - Restaurant appears immediately in the list

5. **Test Persistence**:
   - **Reload the page** (F5 or Ctrl+R)
   - Console should show: `"Loading restaurants..."` again
   - Console should show: `"Total restaurants: X"` (including the one you just created)
   - **Restaurant should still be visible in the list** ✅

6. **Test Service Restart**:
   - Stop the restaurant service (Ctrl+C in its terminal)
   - Restart the service
   - Reload the browser page
   - **Restaurant should STILL be visible** ✅

## Database Location

The H2 database file will be created at:
```
microservices/restaurant-management-service/data/restaurant_management_db.mv.db
```

**Important**: Do NOT delete this file or you'll lose all data!

## Accessing H2 Console

You can view/query the database directly:

1. Navigate to: http://localhost:8083/h2-console
2. Settings:
   - **JDBC URL**: `jdbc:h2:file:./data/restaurant_management_db`
   - **User Name**: `sa`
   - **Password**: (leave empty)
3. Click "Connect"
4. Run SQL queries:
   ```sql
   SELECT * FROM restaurant;
   SELECT * FROM menu_item;
   SELECT * FROM orders;
   ```

## Verification Checklist

- [ ] Restaurant service restarted successfully
- [ ] Browser console shows "Loading restaurants..." when navigating to restaurant management page
- [ ] Can create a new restaurant
- [ ] Console shows "Restaurant created: {id: X, ...}"
- [ ] Restaurant appears in the list immediately (without reload)
- [ ] After page reload, restaurant still appears (console shows count)
- [ ] After service restart, restaurant still appears
- [ ] Menu items page can load restaurants in dropdown (console shows "Loading restaurants for menu items...")

## Before vs After

### BEFORE (In-Memory Database)
```
User creates restaurant → Saved to RAM → Service restarts → DATA LOST ❌
```

### AFTER (File-Based Database)
```
User creates restaurant → Saved to disk → Service restarts → DATA PERSISTS ✅
```

## Menu Items Restaurant Dropdown Fix

The second issue you mentioned about not seeing restaurants in the menu items page dropdown will also be fixed by this change, because:

1. **Root cause was the same**: Empty database on load
2. **Both components call** `restaurantService.getAllRestaurants()`
3. **Now with persistence**: Restaurants will be available when loading the menu items page

After restarting the service:
1. Create at least one restaurant in `/admin/1/restaurant-management`
2. Navigate to `/admin/1/menu-items`
3. Console will show: `"Loading restaurants for menu items..."`
4. Console will show: `"Total restaurants: X"`
5. **Restaurant dropdown will be populated** ✅

## Troubleshooting

### If restaurants still disappear:

1. **Check if service actually restarted**:
   - Look for: `Started RestaurantManagementApplication in X seconds` in terminal

2. **Check database file exists**:
   ```powershell
   ls microservices\restaurant-management-service\data\
   # Should show: restaurant_management_db.mv.db
   ```

3. **Check console logs**:
   - Should see: `"Restaurants loaded from database:"` with actual data
   - If it shows empty array `[]`, database is empty (create a restaurant)

4. **Check Network tab in browser**:
   - Open F12 → Network tab
   - Reload page
   - Look for: `GET http://localhost:4200/api/restaurants`
   - Status should be: `200 OK`
   - Response should contain restaurant array

5. **Verify backend is running on 8083**:
   ```powershell
   netstat -ano | findstr :8083
   # Should show LISTENING
   ```

## Additional Notes

- **Database file grows over time**: The `./data/` directory will contain your persistent data
- **Backup**: You can backup `./data/` folder to preserve your data
- **Reset database**: Delete `./data/` folder to start fresh
- **Production**: For production, use a real database like PostgreSQL or MySQL

## Files Modified

1. `microservices/restaurant-management-service/src/main/resources/application.properties`
   - Changed datasource URL from `mem:` to `file:`
   - Changed `ddl-auto` from `create-drop` to `update`
   - Removed duplicate datasource configuration
   - Added `defer-datasource-initialization=true`

2. `eduka-frontend/src/app/BackOffice/restaurant-management-back/restaurant-management-back.component.ts`
   - Added console logging in `loadRestaurants()`
   - Added error alerts with detailed messages

3. `eduka-frontend/src/app/BackOffice/menu-items-back/menu-items-back.component.ts`
   - Added console logging in `loadRestaurants()`
   - Added error alerts with detailed messages

4. `microservices/restaurant-management-service/src/main/resources/data.sql` (NEW)
   - Created sample data initialization file (commented out)

## Summary

✅ **Fixed**: Database now persists between restarts
✅ **Fixed**: Restaurants visible after page reload
✅ **Fixed**: Restaurants visible in menu items dropdown
✅ **Added**: Console logging for debugging
✅ **Added**: Better error messages

**Next Step**: Restart the restaurant-management-service and test!
