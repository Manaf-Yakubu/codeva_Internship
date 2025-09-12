# Simple REST API with Node.js & Express

A simple REST API built with Node.js and Express that provides CRUD operations for managing users. This project demonstrates basic API development concepts including routing, middleware, error handling, and proper HTTP response codes.

## Features

- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Input validation and error handling
- ✅ Proper HTTP status codes
- ✅ Security middleware (Helmet)
- ✅ CORS support
- ✅ In-memory data storage
- ✅ RESTful API design

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Postman, Thunder Client, or any API testing tool

## Installation

1. Clone or download this project
2. Navigate to the project directory:
   ```bash
   cd Task_2
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Running the Server

### Development Mode (with auto-restart)
```bash
{{ ... }}
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Base URL
```
http://localhost:3001
```

### Health Check
- **GET** `/health`
- **Description**: Check if the server is running
- **Response**: 
  ```json
  {
    "success": true,
    "message": "Server is running",
    "timestamp": "2025-09-11T20:28:02.000Z"
  }
  ```

### Users API

#### 1. Get All Users
- **GET** `/api/users`
- **Description**: Retrieve all users
- **Response**: 
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john@gmail.com",
        "age": 30
      }
    ],
    "count": 1
  }
  ```

#### 2. Get User by ID
- **GET** `/api/users/:id`
- **Description**: Retrieve a specific user by ID
- **Parameters**: 
  - `id` (path parameter): User ID
- **Response**: 
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "name": "John Doe",
      "email": "john@gmail.com",
      "age": 30
    }
  }
  ```

#### 3. Create New User
- **POST** `/api/users`
- **Description**: Create a new user
- **Request Body**:
  ```json
  {
    "name": "Alice Johnson",
    "email": "alice@gmail.com",
    "age": 28
  }
  ```
- **Response**: 
  ```json
  {
    "success": true,
    "message": "User created successfully",
    "data": {
      "id": 4,
      "name": "Alice Johnson",
      "email": "alice@gmail.com",
      "age": 28
    }
  }
  ```

#### 4. Update User
- **PUT** `/api/users/:id`
- **Description**: Update an existing user
- **Parameters**: 
  - `id` (path parameter): User ID
- **Request Body**:
  ```json
  {
    "name": "Alice Smith",
    "email": "alice.smith@gmail.com",
    "age": 29
  }
  ```
- **Response**: 
  ```json
  {
    "success": true,
    "message": "User updated successfully",
    "data": {
      "id": 4,
      "name": "Alice Smith",
      "email": "manaf@gmail.com",
      "age": 29
    }
  }
  ```

#### 5. Delete User
- **DELETE** `/api/users/:id`
- **Description**: Delete a user by ID
- **Parameters**: 
  - `id` (path parameter): User ID
- **Response**: 
  ```json
  {
    "success": true,
    "message": "User deleted successfully",
    "data": {
      "id": 4,
      "name": "Alice Smith",
      "email": "alice.smith@gmail.com",
      "age": 29
    }
  }
  ```

## Testing with Postman/Thunder Client

### 1. Test GET All Users
```
Method: GET
URL: http://localhost:3001/api/users
```

### 2. Test GET User by ID
```
Method: GET
URL: http://localhost:3001/api/users/1
```

### 3. Test CREATE User
```
Method: POST
URL: http://localhost:3001/api/users
Headers: Content-Type: application/json
Body (raw JSON):
{
  "name": "Test User",
  "email": "test@example.com",
  "age": 25
}
```

### 4. Test UPDATE User
```
Method: PUT
URL: http://localhost:3001/api/users/1
Headers: Content-Type: application/json
Body (raw JSON):
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "age": 26
}
```

### 5. Test DELETE User
```
Method: DELETE
URL: http://localhost:3001/api/users/1
```

## Testing with cURL

### Get All Users
```bash
curl -X GET http://localhost:3001/api/users
```

### Get User by ID
```bash
curl -X GET http://localhost:3001/api/users/1
```

### Create New User
```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","age":25}'
```

### Update User
```bash
curl -X PUT http://localhost:3001/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name","email":"updated@example.com","age":26}'
```

### Delete User
```bash
curl -X DELETE http://localhost:3001/api/users/1
```

## Error Handling

The API returns consistent error responses:

### Validation Error (400)
```json
{
  "success": false,
  "message": "Name is required and must be a non-empty string"
}
```

### Not Found Error (404)
```json
{
  "success": false,
  "message": "User not found"
}
```

### Conflict Error (409)
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details..."
}
```

## Data Validation Rules

- **Name**: Required, non-empty string
- **Email**: Required, must contain '@' symbol
- **Age**: Required, number between 0 and 150
- **Email Uniqueness**: Each user must have a unique email address

## Project Structure

```
Task_2/
├── server.js          # Main server file with all routes and logic
├── package.json       # Project dependencies and scripts
├── README.md         # This documentation file
└── node_modules/     # Dependencies (created after npm install)
```

## Technologies Used

- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **Helmet**: Security middleware
- **CORS**: Cross-origin resource sharing
- **Nodemon**: Development auto-restart (dev dependency)

## Next Steps for Enhancement

1. **Database Integration**: Replace in-memory storage with MongoDB, PostgreSQL, or MySQL
2. **Authentication**: Add JWT-based authentication
3. **Logging**: Implement proper logging with Winston or similar
4. **Testing**: Add unit and integration tests with Jest or Mocha
5. **Validation**: Use libraries like Joi or express-validator for robust validation
6. **Documentation**: Add Swagger/OpenAPI documentation
7. **Rate Limiting**: Implement rate limiting for API protection
8. **Pagination**: Add pagination for large datasets

## License

MIT License - feel free to use this project for learning and development purposes.
