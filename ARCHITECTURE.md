# Job Connect Backend - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client (Frontend)                      │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ HTTP/HTTPS
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                    Express Server                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Middleware Layer                        │  │
│  │  • CORS                                              │  │
│  │  • Body Parser                                      │  │
│  │  • Logger (Morgan)                                  │  │
│  │  • Authentication (JWT)                             │  │
│  │  • Authorization (Role-based)                       │  │
│  │  • Validation (express-validator)                   │  │
│  │  • Error Handler                                    │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  Routes Layer                        │  │
│  │  /api/auth      → Authentication routes              │  │
│  │  /api/users     → User management routes            │  │
│  │  /api/jobs      → Job CRUD routes                   │  │
│  │  /api/applications → Application routes             │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                Controllers Layer                     │  │
│  │  • Business Logic                                    │  │
│  │  • Request Processing                                │  │
│  │  • Response Formatting                               │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ Mongoose ODM
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                    MongoDB Database                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │    Users     │  │     Jobs     │  │ Applications │     │
│  │  Collection  │  │  Collection  │  │  Collection  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## MVC Architecture Pattern

### Model (M) - Data Layer
**Location**: `models/`

- **User.model.js**: Defines user schema and methods
- **Job.model.js**: Defines job schema and methods
- **Application.model.js**: Defines application schema and methods

**Responsibilities**:
- Database schema definition
- Data validation at schema level
- Business logic methods (e.g., password hashing)
- Relationships between collections

### View (V) - Presentation Layer
**In REST API context**: JSON responses

- Controllers format responses as JSON
- Consistent response structure:
  ```json
  {
    "success": true/false,
    "message": "Optional message",
    "data": { ... }
  }
  ```

### Controller (C) - Business Logic Layer
**Location**: `controllers/`

- **auth.controller.js**: Authentication logic
- **user.controller.js**: User management logic
- **job.controller.js**: Job CRUD operations
- **application.controller.js**: Application management

**Responsibilities**:
- Process incoming requests
- Interact with models
- Apply business rules
- Format and send responses
- Handle errors

## Request Flow

```
1. Client Request
   │
   ├─► Express Server
   │
2. Middleware Chain
   │
   ├─► CORS Middleware
   │   └─► Handles cross-origin requests
   │
   ├─► Body Parser
   │   └─► Parses JSON/URL-encoded bodies
   │
   ├─► Logger (Morgan)
   │   └─► Logs request details
   │
   ├─► Route Matching
   │   └─► Matches URL to route handler
   │
   ├─► Validation Middleware
   │   └─► Validates request data
   │
   ├─► Authentication Middleware (if protected)
   │   └─► Verifies JWT token
   │
   ├─► Authorization Middleware (if role-based)
   │   └─► Checks user role
   │
3. Controller Function
   │
   ├─► Business Logic
   │   ├─► Database Queries (via Models)
   │   ├─► Data Processing
   │   └─► Response Preparation
   │
4. Response
   │
   └─► Client receives JSON response
```

## Error Handling Flow

```
Error Occurs
   │
   ├─► Caught by try-catch in controller
   │   └─► Passed to next(error)
   │
   ├─► Error Handler Middleware
   │   ├─► Logs error
   │   ├─► Formats error response
   │   └─► Sends error to client
   │
   └─► Client receives error response
```

## Authentication & Authorization Flow

### Registration/Login Flow
```
1. User submits credentials
   │
2. Controller validates input
   │
3. Controller checks database
   │
4. Controller generates JWT token
   │
5. Token returned to client
   │
6. Client stores token
```

### Protected Route Access Flow
```
1. Client sends request with token
   │
2. Auth Middleware extracts token
   │
3. Auth Middleware verifies token
   │
4. Auth Middleware loads user from DB
   │
5. Authorization Middleware checks role
   │
6. Request proceeds to controller
```

## Database Schema Relationships

```
Users (1) ──────< (Many) Jobs
   │                    │
   │                    │
   │                    │
   └───< (Many) Applications >─── (1) Jobs
```

- **One User** can post **Many Jobs** (if recruiter)
- **One User** can submit **Many Applications** (if job seeker)
- **One Job** can have **Many Applications**
- **One Application** belongs to **One User** and **One Job**

## Security Layers

### 1. Password Security
- Passwords hashed using bcryptjs
- Salt rounds: 10
- Passwords never returned in responses

### 2. Authentication
- JWT tokens for stateless authentication
- Tokens expire after 7 days (configurable)
- Secret key stored in environment variables

### 3. Authorization
- Role-based access control (RBAC)
- Two roles: `job_seeker`, `recruiter`
- Middleware enforces role restrictions

### 4. Input Validation
- express-validator for request validation
- Schema-level validation in Mongoose models
- Prevents invalid data entry

### 5. Error Handling
- No sensitive information in error messages
- Stack traces only in development mode
- Consistent error response format

## Middleware Stack

### Order of Execution:
1. **CORS** - Handles cross-origin requests
2. **Body Parser** - Parses request bodies
3. **Logger** - Logs requests
4. **Routes** - Route matching
5. **Validation** - Request validation
6. **Authentication** - JWT verification
7. **Authorization** - Role checking
8. **Controller** - Business logic
9. **Error Handler** - Error processing

## Module Dependencies

```
server.js
├── express
├── mongoose
├── dotenv
├── cors
├── morgan
│
routes/
├── controllers/
│   ├── models/
│   └── middleware/
│
middleware/
├── jsonwebtoken
├── express-validator
└── morgan
```

## Scalability Considerations

### Current Design Supports:
- ✅ Horizontal scaling (stateless JWT)
- ✅ Database indexing (MongoDB indexes)
- ✅ Modular architecture (easy to extend)
- ✅ Separation of concerns (MVC)

### Future Enhancements:
- Add caching layer (Redis)
- Add message queue for async tasks
- Implement rate limiting
- Add API versioning
- Implement database sharding if needed

## Best Practices Implemented

1. **Separation of Concerns**: Clear MVC structure
2. **DRY Principle**: Reusable middleware and utilities
3. **Error Handling**: Centralized error handling
4. **Security**: Password hashing, JWT, input validation
5. **Code Organization**: Logical folder structure
6. **Documentation**: Comprehensive README and API docs
7. **Environment Configuration**: Environment variables for config
8. **Logging**: Request logging for debugging
9. **Validation**: Multiple layers of validation
10. **RESTful Design**: Standard REST API conventions

## Technology Choices Rationale

### Node.js + Express
- **Why**: Fast, lightweight, great ecosystem
- **Best for**: REST APIs, real-time applications

### MongoDB
- **Why**: Flexible schema, easy to start, NoSQL simplicity
- **Best for**: Rapid development, flexible data models

### JWT Authentication
- **Why**: Stateless, scalable, industry standard
- **Best for**: REST APIs, microservices

### Mongoose ODM
- **Why**: Schema validation, middleware, easy queries
- **Best for**: Type safety, data validation

## Testing Strategy (Recommended)

### Unit Tests
- Test individual controller functions
- Test model methods
- Test middleware functions

### Integration Tests
- Test API endpoints
- Test database operations
- Test authentication flow

### Test Tools
- Jest or Mocha for testing framework
- Supertest for API testing
- MongoDB Memory Server for test database

---

This architecture provides a solid foundation for a lab project while following industry best practices.

