# Quick Start Guide - Job Connect Backend

This guide will help you get the backend up and running quickly.

## Prerequisites Checklist

- [ ] Node.js installed (v14 or higher)
- [ ] MongoDB installed and running (or MongoDB Atlas account)
- [ ] npm or yarn package manager

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages:
- express
- mongoose
- jsonwebtoken
- bcryptjs
- dotenv
- express-validator
- cors
- morgan

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# Copy the example file (if .env.example exists)
cp .env.example .env

# Or create manually
touch .env
```

Add the following to your `.env` file:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/jobconnect
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

**Important**: 
- For local MongoDB: Use `mongodb://localhost:27017/jobconnect`
- For MongoDB Atlas: Use your connection string from Atlas dashboard
- Change `JWT_SECRET` to a strong random string in production

### 3. Start MongoDB

**Option A: Local MongoDB**
```bash
# macOS (using Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
# Start MongoDB service from Services panel
```

**Option B: MongoDB Atlas (Cloud)**
- Create account at https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get connection string and update `MONGODB_URI` in `.env`

### 4. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on port 3000
📝 Environment: development
```

### 5. Test the API

**Health Check:**
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Job Connect API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Register a User:**
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

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Save the `token` from the response for authenticated requests.

**Get Jobs (Public):**
```bash
curl http://localhost:3000/api/jobs
```

**Get Jobs (Authenticated):**
```bash
curl http://localhost:3000/api/jobs \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Common Issues & Solutions

### Issue: MongoDB Connection Error

**Error**: `MongoServerError: connect ECONNREFUSED`

**Solution**:
1. Make sure MongoDB is running
2. Check if MongoDB is on the default port (27017)
3. Verify `MONGODB_URI` in `.env` is correct
4. For Atlas: Check IP whitelist and connection string

### Issue: Port Already in Use

**Error**: `EADDRINUSE: address already in use :::3000`

**Solution**:
1. Change `PORT` in `.env` to a different port (e.g., 3001)
2. Or stop the process using port 3000:
   ```bash
   # Find process
   lsof -ti:3000
   # Kill process
   kill -9 $(lsof -ti:3000)
   ```

### Issue: Module Not Found

**Error**: `Cannot find module 'express'`

**Solution**:
```bash
npm install
```

### Issue: JWT Token Invalid

**Error**: `Not authorized to access this route`

**Solution**:
1. Make sure you're including the token in the Authorization header
2. Check if token has expired (default: 7 days)
3. Verify `JWT_SECRET` matches between token creation and verification

## Project Structure Overview

```
job-connect-backend/
├── config/          # Configuration files
├── controllers/     # Business logic
├── middleware/      # Custom middleware
├── models/          # Database models
├── routes/          # API routes
├── server.js        # Entry point
└── package.json     # Dependencies
```

## Next Steps

1. **Test all endpoints** using Postman or curl
2. **Create test users** (both job_seeker and recruiter roles)
3. **Create job listings** as a recruiter
4. **Submit applications** as a job seeker
5. **Review applications** as a recruiter

## Development Tips

1. **Use Postman** or **Insomnia** for easier API testing
2. **Check logs** in `logs/access.log` for request history
3. **Use nodemon** (`npm run dev`) for automatic server restart
4. **Read the README.md** for detailed documentation
5. **Check API_DOCUMENTATION.md** for all endpoint details

## Testing Workflow Example

1. Register as a recruiter:
   ```json
   {
     "name": "Jane Recruiter",
     "email": "jane@company.com",
     "password": "password123",
     "role": "recruiter"
   }
   ```

2. Login and save the token

3. Create a job (use the token):
   ```json
   {
     "title": "Software Developer",
     "description": "We need a developer...",
     "company": "Tech Corp",
     "location": "New York",
     "type": "full-time"
   }
   ```

4. Register as a job seeker

5. Login as job seeker and get token

6. Apply to the job using the job seeker token

7. Switch back to recruiter token and view/update applications

## Need Help?

- Check the main **README.md** for detailed documentation
- Review **API_DOCUMENTATION.md** for endpoint details
- Check MongoDB connection if database errors occur
- Verify environment variables are set correctly

Happy coding! 🚀

