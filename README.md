# Task Tracker Server

A production-ready RESTful API for task management with JWT authentication, built with Node.js, Express, and MongoDB.

## Features

- User authentication (Register, Login, Logout)
- JWT-based authentication with access and refresh tokens
- CRUD operations for tasks
- Task filtering by status and priority
- Pagination support
- User profile management
- Password hashing with bcrypt
- Input validation
- Error handling middleware
- CORS enabled

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variable management

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (v4.4 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/pandey-sweta/task-tracker-server.git
cd task-tracker-server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment variables file

Create a `.env` file in the root directory:

```bash
touch .env
```

### 4. Configure environment variables

Add the following variables to your `.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/tasktracker

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here_change_this_in_production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

**Important Security Notes:**
- Replace `your_super_secret_jwt_key_here_change_this_in_production` with a strong random string
- Replace `your_super_secret_refresh_key_here_change_this_in_production` with another strong random string
- Never commit your `.env` file to version control
- Use different secrets for development and production

**Generate secure secrets (run in terminal):**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 5. Start MongoDB

Make sure MongoDB is running on your machine:

**macOS (Homebrew):**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

**Windows:**
- Start MongoDB from Services or run `mongod` in terminal

**Verify MongoDB is running:**
```bash
mongosh
# or
mongo
```

### 6. Run the application

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000` (or your configured PORT)

### 7. Verify installation

Open your browser or Postman and visit:
```
http://localhost:5000/health
```

You should see:
```json
{
  "success": true,
  "message": "Task Tracker API is running"
}
```

## Project Structure

```
task-tracker-server/
├── src/
│   ├── config/
│   │   ├── db.js                 # Database connection
│   │   └── env.js                # Environment variables
│   ├── controllers/
│   │   ├── auth.controller.js    # Authentication logic
│   │   ├── user.controller.js    # User profile logic
│   │   └── task.controller.js    # Task CRUD logic
│   ├── middlewares/
│   │   ├── auth.middleware.js    # JWT verification
│   │   └── error.middleware.js   # Error handling
│   ├── models/
│   │   ├── User.model.js         # User schema
│   │   └── Task.model.js         # Task schema
│   ├── routes/
│   │   ├── auth.routes.js        # Auth endpoints
│   │   ├── user.routes.js        # User endpoints
│   │   └── task.routes.js        # Task endpoints
│   ├── utils/
│   │   ├── asyncHandler.js       # Async error handler
│   │   └── generateToken.js      # JWT token generation
│   ├── app.js                    # Express app setup
│   └── server.js                 # Server entry point
├── .env                          # Environment variables (create this)
├── .gitignore                    # Git ignore file
├── package.json                  # Project dependencies
└── README.md                     # This file
```

## API Documentation

### Base URL
```
http://localhost:5000
```

---

## Authentication APIs

### 1. Register User

**Endpoint:** `POST /api/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "User already exists"
}
```

---

### 2. Login User

**Endpoint:** `POST /api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### 3. Refresh Access Token

**Endpoint:** `POST /api/auth/refresh-token`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 4. Logout User

**Endpoint:** `POST /api/auth/logout`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <accessToken>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## User Profile APIs

**Note:** All user APIs require authentication. Include the access token in the Authorization header.

### 5. Get User Profile

**Endpoint:** `GET /api/user/profile`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

---

### 6. Update User Profile

**Endpoint:** `PUT /api/user/profile`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <accessToken>
```

**Request Body (all fields optional):**
```json
{
  "name": "John Updated",
  "email": "johnupdated@example.com",
  "password": "newpassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Updated",
      "email": "johnupdated@example.com",
      "updatedAt": "2024-01-15T11:30:00.000Z"
    }
  }
}
```

---

### 7. Delete User Profile

**Endpoint:** `DELETE /api/user/profile`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## Task APIs

**Note:** All task APIs require authentication.

### 8. Create Task

**Endpoint:** `POST /api/tasks`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "status": "todo",
  "priority": "high",
  "dueDate": "2025-12-31T23:59:59.999Z"
}
```

**Field Details:**
- `title` (required) - Task title
- `description` (optional) - Task description
- `status` (optional) - One of: `todo`, `in-progress`, `in_progress`, `completed` (default: `todo`)
- `priority` (optional) - One of: `low`, `medium`, `high` (default: `medium`)
- `dueDate` (optional) - ISO 8601 date string

**Success Response (201):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "task": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Complete project documentation",
      "description": "Write comprehensive API documentation",
      "status": "todo",
      "priority": "high",
      "dueDate": "2025-12-31T23:59:59.999Z",
      "user": "507f1f77bcf86cd799439012",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

---

### 9. Get All Tasks (with filters)

**Endpoint:** `GET /api/tasks`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Query Parameters (all optional):**
- `status` - Filter by status (`todo`, `in-progress`, `in_progress`, `completed`)
- `priority` - Filter by priority (`low`, `medium`, `high`)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Example Requests:**
```
GET /api/tasks
GET /api/tasks?status=todo
GET /api/tasks?priority=high
GET /api/tasks?status=in-progress&priority=high
GET /api/tasks?page=2&limit=20
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Complete project documentation",
        "description": "Write comprehensive API documentation",
        "status": "todo",
        "priority": "high",
        "dueDate": "2025-12-31T23:59:59.999Z",
        "user": "507f1f77bcf86cd799439012",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalTasks": 47,
      "limit": 10
    }
  }
}
```

---

### 10. Get Task by ID

**Endpoint:** `GET /api/tasks/:id`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Example:**
```
GET /api/tasks/507f1f77bcf86cd799439011
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "task": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Complete project documentation",
      "description": "Write comprehensive API documentation",
      "status": "todo",
      "priority": "high",
      "dueDate": "2025-12-31T23:59:59.999Z",
      "user": "507f1f77bcf86cd799439012",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Task not found"
}
```

---

### 11. Update Task

**Endpoint:** `PUT /api/tasks/:id`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <accessToken>
```

**Request Body (all fields optional):**
```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "status": "in-progress",
  "priority": "medium",
  "dueDate": "2025-12-31T23:59:59.999Z"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "task": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Updated task title",
      "description": "Updated description",
      "status": "in-progress",
      "priority": "medium",
      "dueDate": "2025-12-31T23:59:59.999Z",
      "user": "507f1f77bcf86cd799439012",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T12:30:00.000Z"
    }
  }
}
```

---

### 12. Delete Task

**Endpoint:** `DELETE /api/tasks/:id`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Example:**
```
DELETE /api/tasks/507f1f77bcf86cd799439011
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error message here",
  "stack": "Error stack trace (only in development mode)",
  "error": {}
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created successfully
- `400` - Bad request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (invalid/expired token)
- `404` - Not found
- `500` - Internal server error

---

## Testing with Postman

### 1. Import into Postman

You can test all APIs using Postman. Follow these steps:

### 2. Create Environment Variables

In Postman, create an environment with these variables:

- `baseUrl` = `http://localhost:5000`
- `accessToken` = (will be set automatically)
- `refreshToken` = (will be set automatically)

### 3. Testing Workflow

**Step 1: Register a new user**
```
POST {{baseUrl}}/api/auth/register
```

**Step 2: Save the tokens**

After registration/login, go to the "Tests" tab in Postman and add:

```javascript
// Save tokens to environment variables
if (pm.response.code === 200 || pm.response.code === 201) {
    const jsonData = pm.response.json();
    pm.environment.set("accessToken", jsonData.data.accessToken);
    pm.environment.set("refreshToken", jsonData.data.refreshToken);
}
```

**Step 3: Use tokens in requests**

For protected endpoints, add to Authorization header:
```
Bearer {{accessToken}}
```

**Step 4: Test all endpoints**

Follow this order:
1. Register user
2. Login user
3. Get profile
4. Create tasks
5. Get all tasks
6. Get task by ID
7. Update task
8. Delete task
9. Refresh token
10. Logout

---

## How to Use in Backend Integration

### Frontend Integration Example

**1. Register/Login:**

```javascript
// Register user
const register = async (name, email, password) => {
  const response = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, email, password })
  });

  const data = await response.json();

  if (data.success) {
    // Save tokens to localStorage
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
  }

  return data;
};

// Login user
const login = async (email, password) => {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  if (data.success) {
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
  }

  return data;
};
```

**2. Make authenticated requests:**

```javascript
// Get all tasks
const getTasks = async () => {
  const accessToken = localStorage.getItem('accessToken');

  const response = await fetch('http://localhost:5000/api/tasks', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  const data = await response.json();
  return data;
};

// Create task
const createTask = async (taskData) => {
  const accessToken = localStorage.getItem('accessToken');

  const response = await fetch('http://localhost:5000/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify(taskData)
  });

  const data = await response.json();
  return data;
};
```

**3. Handle token refresh:**

```javascript
// Refresh access token when it expires
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');

  const response = await fetch('http://localhost:5000/api/auth/refresh-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ refreshToken })
  });

  const data = await response.json();

  if (data.success) {
    localStorage.setItem('accessToken', data.data.accessToken);
  }

  return data;
};

// Axios interceptor example (auto-refresh on 401)
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newToken = await refreshAccessToken();
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + newToken.data.accessToken;

      return axios(originalRequest);
    }

    return Promise.reject(error);
  }
);
```

**4. Logout:**

```javascript
const logout = async () => {
  const accessToken = localStorage.getItem('accessToken');

  await fetch('http://localhost:5000/api/auth/logout', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  // Clear tokens from storage
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};
```

---

## Security Best Practices

1. **Never commit `.env` file** - Add it to `.gitignore`
2. **Use strong JWT secrets** - At least 64 characters, random
3. **Use HTTPS in production** - Never send tokens over HTTP
4. **Set short expiry for access tokens** - 15 minutes is recommended
5. **Validate all inputs** - Mongoose validation + controller validation
6. **Hash passwords** - Using bcrypt with salt rounds ≥ 10
7. **Rate limiting** - Consider adding rate limiting middleware in production
8. **CORS configuration** - Restrict allowed origins in production

---

## Troubleshooting

### MongoDB Connection Error

**Error:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution:**
- Make sure MongoDB is running: `brew services start mongodb-community` (macOS)
- Check MongoDB URI in `.env` file
- Verify MongoDB is listening on port 27017: `lsof -i :27017`

### JWT Secret Not Defined

**Error:** `JWT_SECRET is not defined`

**Solution:**
- Create `.env` file in root directory
- Add `JWT_SECRET=your_secret_key_here`

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
- Change PORT in `.env` file
- Or kill process using port 5000: `lsof -ti:5000 | xargs kill`

### Token Expired

**Error:** `Not authorized, token failed`

**Solution:**
- Use refresh token endpoint to get new access token
- Re-login if refresh token is also expired

---

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a pull request

---

## License

This project is licensed under the ISC License.

---

## Author

Sweta Pandey - pandey-sweta

Project Link: [https://github.com/pandey-sweta/task-tracker-server](https://github.com/pandey-sweta/task-tracker-server)

---

## Acknowledgments

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)
- [MongoDB Documentation](https://docs.mongodb.com/)
