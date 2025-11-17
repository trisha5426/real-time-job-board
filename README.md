# Job Connect App - Backend API

A simple, modular backend API for a job board application built with Node.js, Express, and MongoDB. This backend is designed for Software Engineering lab settings with clean MVC architecture.

## 📁 Project Structure

```
job-connect-backend/
├── config/
│   └── database.js          # MongoDB connection configuration
├── controllers/             # Business logic layer
│   ├── auth.controller.js   # Authentication logic
│   ├── user.controller.js  # User management logic
│   ├── job.controller.js   # Job CRUD operations
│   └── application.controller.js  # Application management
├── middleware/              # Custom middleware
│   ├── auth.middleware.js  # JWT authentication & authorization
│   ├── validation.middleware.js  # Request validation
│   ├── errorHandler.middleware.js  # Global error handling
│   └── logger.middleware.js  # Request logging
├── models/                  # Database models (Mongoose schemas)
│   ├── User.model.js       # User schema
│   ├── Job.model.js        # Job schema
│   └── Application.model.js  # Application schema
├── routes/                  # API route definitions
│   ├── auth.routes.js      # Authentication routes
│   ├── user.routes.js      # User routes
│   ├── job.routes.js       # Job routes
│   └── application.routes.js  # Application routes
├── logs/                    # Application logs (auto-generated)
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies and scripts
├── server.js               # Main application entry point
└── README.md               # This file
```

## 📂 Folder Purpose Explanation

### `config/`
Contains configuration files for external services (database, third-party APIs, etc.). The `database.js` file handles MongoDB connection setup.

### `controllers/`
Contains the business logic for each module. Controllers handle:
- Processing requests
- Interacting with models
- Returning responses
- Error handling

### `middleware/`
Custom middleware functions that process requests before they reach controllers:
- **auth.middleware.js**: Verifies JWT tokens and checks user roles
- **validation.middleware.js**: Validates request data using express-validator
- **errorHandler.middleware.js**: Centralized error handling
- **logger.middleware.js**: Request logging for debugging

### `models/`
Mongoose schemas defining the database structure. Each model represents a collection in MongoDB:
- **User.model.js**: User accounts (job seekers and recruiters)
- **Job.model.js**: Job postings
- **Application.model.js**: Job applications

### `routes/`
Route definitions that map HTTP endpoints to controller functions. Routes also include:
- Request validation rules
- Authentication/authorization middleware
- Route-specific middleware

## 🗄️ Database Schema

### MongoDB Collections

#### Users Collection
```javascript
{
  _id: ObjectId,
  name: String (required, max 50 chars),
  email: String (required, unique, lowercase),
  password: String (required, min 6 chars, hashed),
  role: String (enum: 'job_seeker' | 'recruiter'),
  profile: {
    phone: String,
    location: String,
    bio: String,
    skills: [String],      // For job seekers
    company: String,       // For recruiters
    website: String        // For recruiters
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### Jobs Collection
```javascript
{
  _id: ObjectId,
  title: String (required, max 100 chars),
  description: String (required),
  company: String (required),
  location: String (required),
  type: String (enum: 'full-time' | 'part-time' | 'contract' | 'internship'),
  salary: {
    min: Number,
    max: Number,
    currency: String (default: 'USD')
  },
  requirements: {
    experience: String,
    education: String,
    skills: [String]
  },
  postedBy: ObjectId (ref: User, required),
  status: String (enum: 'active' | 'closed' | 'draft', default: 'active'),
  applicationDeadline: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### Applications Collection
```javascript
{
  _id: ObjectId,
  job: ObjectId (ref: Job, required),
  applicant: ObjectId (ref: User, required),
  status: String (enum: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'accepted', default: 'pending'),
  coverLetter: String (max 2000 chars),
  resume: {
    url: String,
    fileName: String
  },
  appliedAt: Date (default: now),
  reviewedAt: Date,
  notes: String
}
// Unique index on (job, applicant) to prevent duplicate applications
```

## 🔌 API Endpoints

### Authentication Endpoints

#### Register User
- **POST** `/api/auth/register`
- **Access**: Public
- **Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "job_seeker"
}
```
- **Response** (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "job_seeker"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
- **POST** `/api/auth/login`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "job_seeker"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Get Current User
- **GET** `/api/auth/me`
- **Access**: Private
- **Headers**: `Authorization: Bearer <token>`
- **Response** (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "job_seeker",
      "profile": {}
    }
  }
}
```

### User Management Endpoints

#### Get All Users
- **GET** `/api/users?role=job_seeker&search=john`
- **Access**: Private
- **Query Params**: `role` (optional), `search` (optional)
- **Response** (200):
```json
{
  "success": true,
  "count": 10,
  "data": {
    "users": [...]
  }
}
```

#### Get User by ID
- **GET** `/api/users/:id`
- **Access**: Private
- **Response** (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "job_seeker",
      "profile": {}
    }
  }
}
```

#### Update User
- **PUT** `/api/users/:id`
- **Access**: Private (own profile or recruiter)
- **Request Body**:
```json
{
  "name": "John Updated",
  "profile": {
    "phone": "+1234567890",
    "location": "New York",
    "bio": "Software developer",
    "skills": ["JavaScript", "Node.js"]
  }
}
```

#### Delete User
- **DELETE** `/api/users/:id`
- **Access**: Private (own profile or recruiter)

### Job Listings Endpoints

#### Get All Jobs
- **GET** `/api/jobs?search=developer&type=full-time&location=New York&page=1&limit=10`
- **Access**: Public
- **Query Params**: `search`, `type`, `location`, `status`, `page`, `limit`
- **Response** (200):
```json
{
  "success": true,
  "count": 10,
  "total": 50,
  "page": 1,
  "pages": 5,
  "data": {
    "jobs": [...]
  }
}
```

#### Get Job by ID
- **GET** `/api/jobs/:id`
- **Access**: Public
- **Response** (200):
```json
{
  "success": true,
  "data": {
    "job": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Senior Developer",
      "description": "We are looking for...",
      "company": "Tech Corp",
      "location": "New York",
      "type": "full-time",
      "salary": {
        "min": 80000,
        "max": 120000,
        "currency": "USD"
      },
      "postedBy": {
        "_id": "...",
        "name": "Recruiter Name",
        "email": "recruiter@example.com"
      },
      "status": "active",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### Create Job
- **POST** `/api/jobs`
- **Access**: Private (Recruiter only)
- **Request Body**:
```json
{
  "title": "Senior Developer",
  "description": "We are looking for an experienced developer...",
  "company": "Tech Corp",
  "location": "New York",
  "type": "full-time",
  "salary": {
    "min": 80000,
    "max": 120000,
    "currency": "USD"
  },
  "requirements": {
    "experience": "3-5 years",
    "education": "Bachelor's degree",
    "skills": ["JavaScript", "Node.js", "React"]
  },
  "status": "active",
  "applicationDeadline": "2024-12-31T23:59:59.000Z"
}
```

#### Update Job
- **PUT** `/api/jobs/:id`
- **Access**: Private (Recruiter - owner only)

#### Delete Job
- **DELETE** `/api/jobs/:id`
- **Access**: Private (Recruiter - owner only)

#### Get My Jobs
- **GET** `/api/jobs/my-jobs`
- **Access**: Private (Recruiter only)
- Returns all jobs posted by the current user

### Application Endpoints

#### Get All Applications
- **GET** `/api/applications?status=pending&job=507f1f77bcf86cd799439011`
- **Access**: Private
- **Query Params**: `status`, `job`
- **Note**: Job seekers see only their applications; Recruiters see applications for their jobs
- **Response** (200):
```json
{
  "success": true,
  "count": 5,
  "data": {
    "applications": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "job": {
          "_id": "...",
          "title": "Senior Developer",
          "company": "Tech Corp",
          "location": "New York"
        },
        "applicant": {
          "_id": "...",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "status": "pending",
        "coverLetter": "I am interested in...",
        "appliedAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

#### Get Application by ID
- **GET** `/api/applications/:id`
- **Access**: Private

#### Create Application
- **POST** `/api/applications`
- **Access**: Private (Job seeker only)
- **Request Body**:
```json
{
  "job": "507f1f77bcf86cd799439011",
  "coverLetter": "I am very interested in this position...",
  "resume": {
    "url": "https://example.com/resume.pdf",
    "fileName": "resume.pdf"
  }
}
```

#### Update Application Status
- **PUT** `/api/applications/:id`
- **Access**: Private (Recruiter only - for their jobs)
- **Request Body**:
```json
{
  "status": "shortlisted",
  "notes": "Strong candidate with relevant experience"
}
```

#### Delete Application
- **DELETE** `/api/applications/:id`
- **Access**: Private (Job seeker only - their own applications)

## 🔄 Middleware Flow

### Request Flow
```
1. Request arrives
   ↓
2. CORS Middleware (cors)
   ↓
3. Body Parser (express.json, express.urlencoded)
   ↓
4. Logger Middleware (morgan)
   ↓
5. Route Handler
   ↓
6. Validation Middleware (express-validator)
   ↓
7. Authentication Middleware (JWT verify)
   ↓
8. Authorization Middleware (role check)
   ↓
9. Controller Function
   ↓
10. Response sent
```

### Error Flow
```
Any error occurs
   ↓
Error Handler Middleware catches it
   ↓
Formatted error response sent
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone or navigate to the project directory**
```bash
cd "job connect 1.0"
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```
Edit `.env` and update the values:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/jobconnect
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

4. **Start MongoDB**
   - Local: Make sure MongoDB is running on your machine
   - Atlas: Use your MongoDB Atlas connection string in `.env`

5. **Run the server**
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

6. **Test the API**
```bash
# Health check
curl http://localhost:3000/api/health

# Register a user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "job_seeker"
  }'
```

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

Tokens are obtained by:
1. Registering a new user (`POST /api/auth/register`)
2. Logging in (`POST /api/auth/login`)

## 📝 Key Features

- ✅ JWT-based authentication
- ✅ Role-based authorization (job_seeker, recruiter)
- ✅ Input validation using express-validator
- ✅ Error handling middleware
- ✅ Request logging
- ✅ MongoDB with Mongoose ODM
- ✅ RESTful API design
- ✅ Clean MVC architecture

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Logging**: morgan

## 📚 Next Steps for Implementation

1. **Set up MongoDB**: Install MongoDB locally or create a MongoDB Atlas account
2. **Configure Environment**: Update `.env` file with your settings
3. **Test Endpoints**: Use Postman or curl to test all endpoints
4. **Add File Upload**: Implement resume file upload (consider using multer)
5. **Add Email Notifications**: Send emails when applications are submitted/updated
6. **Add Pagination**: Already implemented for jobs, can be extended
7. **Add Search**: Text search is implemented, can be enhanced
8. **Add Testing**: Write unit and integration tests
9. **Add API Documentation**: Consider using Swagger/OpenAPI

## 🐛 Error Handling

All errors follow a consistent format:
```json
{
  "success": false,
  "message": "Error message here",
  "errors": [...] // For validation errors
}
```

## 📄 License

This project is designed for educational purposes in Software Engineering labs.

---

**Happy Coding! 🚀**

