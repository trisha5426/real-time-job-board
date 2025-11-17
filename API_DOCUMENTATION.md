# Job Connect API - Complete Endpoint Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Most endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### 1. Register User
**POST** `/auth/register`

**Access**: Public

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "job_seeker"
}
```

**Response** (201 Created):
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

**Error Response** (400 Bad Request):
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "msg": "Please provide a valid email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

---

### 2. Login
**POST** `/auth/login`

**Access**: Public

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response** (200 OK):
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

**Error Response** (401 Unauthorized):
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### 3. Get Current User
**GET** `/auth/me`

**Access**: Private

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "job_seeker",
      "profile": {
        "phone": "+1234567890",
        "location": "New York",
        "bio": "Software developer",
        "skills": ["JavaScript", "Node.js"]
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

## 👥 User Management Endpoints

### 4. Get All Users
**GET** `/users?role=job_seeker&search=john`

**Access**: Private

**Query Parameters**:
- `role` (optional): Filter by role (`job_seeker` or `recruiter`)
- `search` (optional): Search by name or email

**Response** (200 OK):
```json
{
  "success": true,
  "count": 10,
  "data": {
    "users": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "job_seeker",
        "profile": {}
      }
    ]
  }
}
```

---

### 5. Get User by ID
**GET** `/users/:id`

**Access**: Private

**Response** (200 OK):
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

---

### 6. Update User
**PUT** `/users/:id`

**Access**: Private (own profile or recruiter)

**Request Body**:
```json
{
  "name": "John Updated",
  "profile": {
    "phone": "+1234567890",
    "location": "New York",
    "bio": "Software developer with 5 years experience",
    "skills": ["JavaScript", "Node.js", "React"],
    "company": "Tech Corp",
    "website": "https://techcorp.com"
  }
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Updated",
      "email": "john@example.com",
      "role": "job_seeker",
      "profile": {
        "phone": "+1234567890",
        "location": "New York",
        "bio": "Software developer with 5 years experience",
        "skills": ["JavaScript", "Node.js", "React"]
      }
    }
  }
}
```

---

### 7. Delete User
**DELETE** `/users/:id`

**Access**: Private (own profile or recruiter)

**Response** (200 OK):
```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": {}
}
```

---

## 💼 Job Listings Endpoints

### 8. Get All Jobs
**GET** `/jobs?search=developer&type=full-time&location=New York&page=1&limit=10`

**Access**: Public

**Query Parameters**:
- `search` (optional): Text search in title, description, company
- `type` (optional): Filter by type (`full-time`, `part-time`, `contract`, `internship`)
- `location` (optional): Filter by location
- `status` (optional): Filter by status (`active`, `closed`, `draft`) - default: `active`
- `page` (optional): Page number for pagination - default: `1`
- `limit` (optional): Items per page - default: `10`

**Response** (200 OK):
```json
{
  "success": true,
  "count": 10,
  "total": 50,
  "page": 1,
  "pages": 5,
  "data": {
    "jobs": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Senior Full Stack Developer",
        "description": "We are looking for an experienced developer...",
        "company": "Tech Corp",
        "location": "New York, NY",
        "type": "full-time",
        "salary": {
          "min": 80000,
          "max": 120000,
          "currency": "USD"
        },
        "requirements": {
          "experience": "3-5 years",
          "education": "Bachelor's degree",
          "skills": ["JavaScript", "Node.js", "React", "MongoDB"]
        },
        "postedBy": {
          "_id": "507f1f77bcf86cd799439012",
          "name": "Jane Recruiter",
          "email": "jane@techcorp.com",
          "profile": {
            "company": "Tech Corp"
          }
        },
        "status": "active",
        "applicationDeadline": "2024-12-31T23:59:59.000Z",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

---

### 9. Get Job by ID
**GET** `/jobs/:id`

**Access**: Public

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "job": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Senior Full Stack Developer",
      "description": "We are looking for an experienced developer...",
      "company": "Tech Corp",
      "location": "New York, NY",
      "type": "full-time",
      "salary": {
        "min": 80000,
        "max": 120000,
        "currency": "USD"
      },
      "requirements": {
        "experience": "3-5 years",
        "education": "Bachelor's degree",
        "skills": ["JavaScript", "Node.js", "React", "MongoDB"]
      },
      "postedBy": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Jane Recruiter",
        "email": "jane@techcorp.com"
      },
      "status": "active",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### 10. Create Job
**POST** `/jobs`

**Access**: Private (Recruiter only)

**Headers**:
```
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "title": "Senior Full Stack Developer",
  "description": "We are looking for an experienced full stack developer to join our team. You will work on cutting-edge projects using modern technologies.",
  "company": "Tech Corp",
  "location": "New York, NY",
  "type": "full-time",
  "salary": {
    "min": 80000,
    "max": 120000,
    "currency": "USD"
  },
  "requirements": {
    "experience": "3-5 years",
    "education": "Bachelor's degree in Computer Science or related field",
    "skills": ["JavaScript", "Node.js", "React", "MongoDB", "Express"]
  },
  "status": "active",
  "applicationDeadline": "2024-12-31T23:59:59.000Z"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Job created successfully",
  "data": {
    "job": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Senior Full Stack Developer",
      "description": "We are looking for...",
      "company": "Tech Corp",
      "location": "New York, NY",
      "type": "full-time",
      "postedBy": "507f1f77bcf86cd799439012",
      "status": "active",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### 11. Update Job
**PUT** `/jobs/:id`

**Access**: Private (Recruiter - owner only)

**Request Body** (all fields optional):
```json
{
  "title": "Updated Job Title",
  "status": "closed",
  "description": "Updated description..."
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Job updated successfully",
  "data": {
    "job": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Updated Job Title",
      "status": "closed",
      "updatedAt": "2024-01-02T00:00:00.000Z"
    }
  }
}
```

---

### 12. Delete Job
**DELETE** `/jobs/:id`

**Access**: Private (Recruiter - owner only)

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Job deleted successfully",
  "data": {}
}
```

---

### 13. Get My Jobs
**GET** `/jobs/my-jobs`

**Access**: Private (Recruiter only)

**Response** (200 OK):
```json
{
  "success": true,
  "count": 5,
  "data": {
    "jobs": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Senior Developer",
        "company": "Tech Corp",
        "status": "active",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

---

## 📝 Application Endpoints

### 14. Get All Applications
**GET** `/applications?status=pending&job=507f1f77bcf86cd799439011`

**Access**: Private

**Query Parameters**:
- `status` (optional): Filter by status (`pending`, `reviewed`, `shortlisted`, `rejected`, `accepted`)
- `job` (optional): Filter by job ID

**Note**: 
- Job seekers see only their own applications
- Recruiters see applications for their posted jobs

**Response** (200 OK):
```json
{
  "success": true,
  "count": 3,
  "data": {
    "applications": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "job": {
          "_id": "507f1f77bcf86cd799439011",
          "title": "Senior Developer",
          "company": "Tech Corp",
          "location": "New York, NY",
          "type": "full-time"
        },
        "applicant": {
          "_id": "507f1f77bcf86cd799439014",
          "name": "John Doe",
          "email": "john@example.com",
          "profile": {
            "skills": ["JavaScript", "Node.js"]
          }
        },
        "status": "pending",
        "coverLetter": "I am very interested in this position...",
        "resume": {
          "url": "https://example.com/resume.pdf",
          "fileName": "resume.pdf"
        },
        "appliedAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

---

### 15. Get Application by ID
**GET** `/applications/:id`

**Access**: Private

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "application": {
      "_id": "507f1f77bcf86cd799439013",
      "job": {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Senior Developer",
        "description": "...",
        "company": "Tech Corp"
      },
      "applicant": {
        "_id": "507f1f77bcf86cd799439014",
        "name": "John Doe",
        "email": "john@example.com",
        "profile": {}
      },
      "status": "pending",
      "coverLetter": "I am very interested...",
      "appliedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### 16. Create Application
**POST** `/applications`

**Access**: Private (Job seeker only)

**Request Body**:
```json
{
  "job": "507f1f77bcf86cd799439011",
  "coverLetter": "I am very interested in this position. I have 5 years of experience in full stack development and believe I would be a great fit for your team.",
  "resume": {
    "url": "https://example.com/resume.pdf",
    "fileName": "john_doe_resume.pdf"
  }
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "application": {
      "_id": "507f1f77bcf86cd799439013",
      "job": {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Senior Developer",
        "company": "Tech Corp"
      },
      "applicant": {
        "_id": "507f1f77bcf86cd799439014",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "status": "pending",
      "coverLetter": "I am very interested...",
      "appliedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Error Response** (400 Bad Request - Already Applied):
```json
{
  "success": false,
  "message": "You have already applied to this job"
}
```

---

### 17. Update Application Status
**PUT** `/applications/:id`

**Access**: Private (Recruiter only - for their jobs)

**Request Body**:
```json
{
  "status": "shortlisted",
  "notes": "Strong candidate with relevant experience. Good communication skills."
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Application updated successfully",
  "data": {
    "application": {
      "_id": "507f1f77bcf86cd799439013",
      "status": "shortlisted",
      "notes": "Strong candidate with relevant experience. Good communication skills.",
      "reviewedAt": "2024-01-02T00:00:00.000Z"
    }
  }
}
```

---

### 18. Delete Application
**DELETE** `/applications/:id`

**Access**: Private (Job seeker only - their own applications)

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Application deleted successfully",
  "data": {}
}
```

---

## 🔍 Health Check

### Health Check
**GET** `/health`

**Access**: Public

**Response** (200 OK):
```json
{
  "status": "OK",
  "message": "Job Connect API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## 📊 Common Error Responses

### 400 Bad Request (Validation Error)
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "msg": "Job title is required",
      "param": "title",
      "location": "body"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Not authorized to update this job"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Job not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Server Error"
}
```

---

## 🔑 Authentication Flow Example

1. **Register or Login** to get a JWT token
2. **Store the token** (in localStorage, sessionStorage, or state)
3. **Include token** in Authorization header for protected routes:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## 📝 Testing with cURL

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "job_seeker"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Jobs (with token)
```bash
curl -X GET http://localhost:3000/api/jobs \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

**Note**: Replace `YOUR_TOKEN_HERE` with the actual JWT token received from login/register.

