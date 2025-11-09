# User ID Integration - Admin Management Service

## Overview
This document describes the integration of `userId` field from the `user-management-nodejs` service into the `admin-management-service` microservice.

## Changes Made

### 1. Entity Updates

#### AcademicProgram.java
- Added `userId` field (String, NOT NULL)
- This field stores the user ID from the user-management service who created the academic program

#### Department.java
- Added `userId` field (String, NOT NULL)
- This field stores the user ID from the user-management service who created the department

### 2. DTO Updates

#### AcademicProgramDTO.java
- Added `userId` field to transfer user information between layers

#### DepartmentDTO.java
- Added `userId` field to transfer user information between layers

### 3. Service Updates

#### AcademicProgramService.java
- Modified `createProgram()` method to accept and store `userId` from DTO
- Updated `convertToDTO()` method to include `userId` in the response

#### DepartmentService.java
- Modified `createDepartment()` method to accept and store `userId` from DTO
- Updated `convertToDTO()` method to include `userId` in the response

## How It Works

1. **Frontend/Client Side**: When creating a new Academic Program or Department, the client must include the `userId` obtained from the JWT token (from user-management-nodejs authentication).

2. **Backend Processing**: 
   - The `userId` is received in the DTO
   - The service layer validates and stores it in the entity
   - The database persists the relationship between the entity and the user

3. **Data Retrieval**: When fetching entities, the `userId` is included in the response, allowing the frontend to display who created each record.

## Example API Request

### Create Academic Program
```json
POST /api/academic-programs
{
  "programName": "Computer Science",
  "programCode": "CS101",
  "description": "Bachelor of Science in Computer Science",
  "duration": "4 years",
  "isActive": true,
  "userId": "user123" // From JWT token
}
```

### Create Department
```json
POST /api/departments
{
  "departmentName": "Software Engineering",
  "departmentCode": "SE001",
  "description": "Software Engineering Department",
  "location": "Building A",
  "academicProgramId": 1,
  "headOfDepartment": "Dr. John Doe",
  "userId": "user123" // From JWT token
}
```

## Database Schema Changes

After running the application, the following columns will be added to the database:

### academic_program table
- `user_id` VARCHAR(255) NOT NULL

### department table
- `user_id` VARCHAR(255) NOT NULL

## Next Steps

1. **Controller Layer**: Update controllers to extract `userId` from JWT token automatically using a custom annotation or interceptor
2. **Frontend Integration**: Update Angular services to include `userId` from the authenticated user
3. **Authorization**: Implement authorization logic to ensure users can only modify their own records (if needed)
4. **User Service Integration**: Optionally create a REST client to fetch user details from user-management-nodejs service

## Important Notes

- The `userId` field is mandatory (NOT NULL) - ensure it's always provided when creating new entities
- The database schema will be automatically updated when the application starts (due to `spring.jpa.hibernate.ddl-auto=create`)
- **WARNING**: Current setting will drop and recreate tables on each startup. Change to `update` or `validate` for production use
