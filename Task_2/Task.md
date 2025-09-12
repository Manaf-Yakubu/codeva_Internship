# Task 2: Simple REST API with Node.js & Express

## Internship Information
- **Company**: Codveda
- **Task Number**: Task 2
- **Intern**: Yakubu Manaf
- **Date**: September 2025

## Task Description
Develop a simple REST API using Node.js with Express framework. Create basic CRUD (Create, Read, Update, Delete) operations on a resource (users).

## Requirements
- [x] Set up an Express server
- [x] Create API routes for CRUD operations
- [x] Use Postman or Thunder Client to test API endpoints
- [x] Handle errors and return proper HTTP responses

## Implementation Details

### Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Security**: Helmet middleware
- **CORS**: Cross-Origin Resource Sharing enabled
- **Data Storage**: In-memory (for demonstration purposes)

### API Endpoints Implemented
1. **Health Check**
   - `GET /health` - Server status check

2. **User Management (CRUD Operations)**
   - `GET /api/users` - Retrieve all users
   - `GET /api/users/:id` - Retrieve user by ID
   - `POST /api/users` - Create new user
   - `PUT /api/users/:id` - Update existing user
   - `DELETE /api/users/:id` - Delete user

### Features Implemented
- ✅ Complete CRUD operations
- ✅ Input validation (name, email, age)
- ✅ Error handling with proper HTTP status codes
- ✅ Security middleware (Helmet)
- ✅ CORS support
- ✅ JSON request/response handling
- ✅ Unique email validation
- ✅ Comprehensive API documentation

### Sample Data
The API includes sample users for testing:
- Yakubu Manaf (ID: 1, Age: 22)
- Hassi Smith (ID: 2, Age: 25)
- Bob Karim (ID: 3, Age: 35)

### Project Structure
```
Task_2/
├── server.js          # Main Express server with all routes
├── package.json       # Project dependencies and scripts
├── README.md         # Comprehensive API documentation
├── test-api.js       # Testing examples and cURL commands
├── Task.md           # This task description file
└── node_modules/     # Dependencies
```

### Testing
The API can be tested using:
- **Postman** - Full-featured API testing tool
- **Thunder Client** - VS Code extension for API testing
- **Browser** - For GET requests
- **cURL/PowerShell** - Command-line testing

### Server Configuration
- **Port**: 3001
- **Base URL**: http://localhost:3001
- **Environment**: Development

### Error Handling
The API returns consistent error responses with appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `409` - Conflict (duplicate email)
- `500` - Internal Server Error

### Learning Outcomes
Through this task, I have gained experience in:
- Building RESTful APIs with Express.js
- Implementing CRUD operations
- Error handling and HTTP status codes
- API documentation and testing
- Middleware usage for security and CORS
- Input validation and data sanitization

## Task Completion Status
✅ **COMPLETED** - All requirements have been successfully implemented and tested.

---
*This task is part of my internship program at Codveda, focusing on backend development with Node.js and Express.*
