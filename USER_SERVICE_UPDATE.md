# 🔄 User Management Service Update

## Summary
The User Management Service has been **migrated from Spring Boot (Java) to Node.js + Express + MongoDB**.

---

## ⚠️ IMPORTANT CHANGES

### Old Configuration (REMOVED)
- ❌ **Java Spring Boot Service** - `microservices/user-management-service/`
- ❌ **Port**: 8087
- ❌ **Database**: H2 (in-memory)
- ❌ **Technology**: Spring Boot, JPA, Maven

### New Configuration (ACTIVE)
- ✅ **Node.js Express Service** - `user-management-nodejs/`
- ✅ **Port**: 3000
- ✅ **Database**: MongoDB (`mongodb://localhost:27017/eduka-users`)
- ✅ **Technology**: Node.js, Express, Mongoose, JWT

---

## 📂 Service Structure

```
user-management-nodejs/
├── index.js                 # Main entry point
├── package.json            # Dependencies
├── .env                    # Environment variables
├── controllers/
│   ├── authController.js   # Login, Register, Logout
│   └── userController.js   # CRUD operations
├── models/
│   └── User.js            # Mongoose User schema
├── routes/
│   ├── authRoutes.js      # /api/auth/*
│   └── userRoutes.js      # /api/users/*
└── middleware/
    └── auth.js            # JWT authentication
```

---

## 🚀 Starting the Service

### Prerequisites
1. **MongoDB** must be running on `localhost:27017`
2. **Node.js** v14+ and **npm** installed

### Commands
```powershell
# Navigate to service directory
cd "c:\Users\saber\Desktop\5SE4\m s\EdukaApp-Springboot-Angular-Micro-services\user-management-nodejs"

# Install dependencies (first time only)
npm install

# Start the service
node index.js
```

✅ **Success Message**: `User management service running on port 3000`

---

## 🔌 API Endpoints

### Authentication (Port 3000)
- **POST** `http://localhost:3000/api/auth/register` - Register new user
- **POST** `http://localhost:3000/api/auth/login` - Login user
- **POST** `http://localhost:3000/api/auth/logout` - Logout user

### User Management (Port 3000)
- **GET** `http://localhost:3000/api/users` - Get all users
- **GET** `http://localhost:3000/api/users/:id` - Get user by ID
- **PUT** `http://localhost:3000/api/users/:id` - Update user
- **DELETE** `http://localhost:3000/api/users/:id` - Delete user
- **POST** `http://localhost:3000/api/users/:id/restaurants/:restaurantId` - Assign restaurant
- **DELETE** `http://localhost:3000/api/users/:id/restaurants/:restaurantId` - Unassign restaurant
- **GET** `http://localhost:3000/api/users/restaurant/:restaurantId` - Get users by restaurant

---

## 🧪 Testing the Service

### Register a New User
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method POST -ContentType "application/json" -Body '{
  "email": "student@uni.edu",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "STUDENT"
}'
```

### Login
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body '{
  "email": "student@uni.edu",
  "password": "password123"
}'
```

### Get All Users (requires JWT token)
```powershell
$token = "your-jwt-token-here"
Invoke-RestMethod -Uri "http://localhost:3000/api/users" -Method GET -Headers @{
  "Authorization" = "Bearer $token"
}
```

---

## 🔧 Frontend Configuration Updated

### Files Modified
1. **`eduka-frontend/src/environments/environment.ts`**
   - Changed `userApiUrl` from `8087` → `3000`
   - Changed `services.userManagement` from `8087` → `3000`

2. **`eduka-frontend/src/environments/environment.prod.ts`**
   - Updated production URLs to use Node.js service

### Angular Services Using User API
- `src/app/services/user.service.ts` - Uses `environment.userApiUrl`
- `src/app/services/auth-dynamic.service.ts` - Authentication
- `src/app/BackOffice/user-restaurant-assignment/` - User assignment component

---

## 🗑️ Manual Cleanup Required

The Java-based `microservices/user-management-service` folder **needs to be manually deleted** because it's currently in use by a process.

### Steps to Delete:
1. Close all PowerShell/Terminal windows
2. Close Visual Studio Code completely
3. Stop any running Java processes:
   ```powershell
   Get-Process java | Stop-Process -Force
   ```
4. Delete the folder:
   ```powershell
   Remove-Item -Path "microservices\user-management-service" -Recurse -Force
   ```

---

## 📊 Database Comparison

| Feature | Old (H2) | New (MongoDB) |
|---------|----------|---------------|
| Type | In-memory SQL | NoSQL Document DB |
| Persistence | Temporary | Permanent |
| Console | http://localhost:8087/h2-console | MongoDB Compass/CLI |
| Schema | Fixed JPA entities | Flexible JSON documents |
| Scaling | Limited | Horizontal scaling |

### MongoDB Access
```powershell
# Connect to MongoDB
mongo mongodb://localhost:27017/eduka-users

# View users collection
db.users.find().pretty()
```

---

## ✅ Benefits of Node.js Migration

1. **Better Performance** - Faster startup, lower memory usage
2. **Real-time Capabilities** - WebSocket support for live updates
3. **Modern Stack** - JWT authentication, bcrypt password hashing
4. **MongoDB Flexibility** - Schema-less design, easy to extend
5. **Microservices Ready** - Independent deployment, scalable
6. **Active Ecosystem** - npm packages, community support

---

## 🔄 Migration Checklist

- [x] Node.js service created with Express + MongoDB
- [x] Authentication endpoints (register, login, logout)
- [x] User CRUD operations
- [x] Restaurant assignment/unassignment
- [x] JWT middleware for protected routes
- [x] CORS configuration for Angular frontend
- [x] Frontend environment files updated (port 3000)
- [ ] **Manual deletion of old Java service folder**
- [ ] MongoDB installed and running
- [ ] Service tested with frontend registration

---

## 🆘 Troubleshooting

### Issue: "Cannot connect to MongoDB"
**Solution**: Start MongoDB service
```powershell
# Windows
net start MongoDB

# Or using MongoDB Compass (GUI)
```

### Issue: "Port 3000 already in use"
**Solution**: Kill process on port 3000
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Issue: "Registration fails with 500 error"
**Solution**: Check MongoDB connection in console logs

### Issue: "CORS error in browser"
**Solution**: Verify CORS origin in `index.js` matches Angular URL:
```javascript
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
```

---

## 📚 Next Steps

1. **Start MongoDB** (if not already running)
2. **Start Node.js User Service** on port 3000
3. **Start Restaurant Service** on port 8086
4. **Start Angular Frontend** on port 4200
5. **Test Registration** at http://localhost:4200/register
6. **Test Login** and navigate to restaurant features

---

## 📞 Support

For issues or questions about the Node.js user service:
- Check MongoDB connection: `mongo --eval "db.runCommand({ping:1})"`
- Check service logs in terminal
- Verify `.env` file configuration
- Test API endpoints using PowerShell or Postman

---

**Last Updated**: November 4, 2025
**Service Version**: Node.js v1.0.0
**Database**: MongoDB 5.0+
