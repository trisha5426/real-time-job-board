# Environment Variables Setup

Create a `.env` file in the root directory with the following variables:

## Required Environment Variables

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/jobconnect

# For MongoDB Atlas (cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jobconnect?retryWrites=true&w=majority

# JWT Configuration
# IMPORTANT: Change this to a strong random string in production!
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

## Variable Descriptions

### PORT
- **Default**: 3000
- **Description**: Port number for the Express server
- **Example**: `PORT=3000` or `PORT=5000`

### NODE_ENV
- **Default**: development
- **Options**: `development`, `production`, `test`
- **Description**: Environment mode (affects error messages, logging)

### MONGODB_URI
- **Required**: Yes
- **Description**: MongoDB connection string
- **Local Format**: `mongodb://localhost:27017/jobconnect`
- **Atlas Format**: `mongodb+srv://username:password@cluster.mongodb.net/jobconnect`

### JWT_SECRET
- **Required**: Yes
- **Description**: Secret key for signing JWT tokens
- **Security**: Use a strong, random string in production
- **Generate**: Use `openssl rand -base64 32` or any random string generator

### JWT_EXPIRE
- **Default**: 7d
- **Description**: Token expiration time
- **Format**: Number + unit (e.g., `7d`, `24h`, `3600s`)

### CORS_ORIGIN
- **Default**: http://localhost:3000
- **Description**: Allowed origin for CORS requests
- **Production**: Set to your frontend URL

## Setup Instructions

1. **Create `.env` file**:
   ```bash
   touch .env
   ```

2. **Copy the template above** into your `.env` file

3. **Update values** according to your setup:
   - Change `JWT_SECRET` to a secure random string
   - Update `MONGODB_URI` with your MongoDB connection string
   - Adjust `PORT` if needed
   - Set `CORS_ORIGIN` to your frontend URL

4. **Never commit `.env` to version control** (already in `.gitignore`)

## MongoDB Setup Options

### Option 1: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Use: `MONGODB_URI=mongodb://localhost:27017/jobconnect`

### Option 2: MongoDB Atlas (Free Tier)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create database user
4. Whitelist your IP (or use 0.0.0.0/0 for development)
5. Get connection string
6. Use: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jobconnect`

## Security Notes

⚠️ **Important**: 
- Never commit `.env` file to Git
- Use strong `JWT_SECRET` in production
- Restrict `CORS_ORIGIN` in production
- Use environment-specific values for different environments

## Example Production `.env`

```env
PORT=3000
NODE_ENV=production
MONGODB_URI=mongodb+srv://prod_user:secure_password@prod-cluster.mongodb.net/jobconnect
JWT_SECRET=super_secure_random_string_here_use_openssl_rand_base64_32
JWT_EXPIRE=24h
CORS_ORIGIN=https://yourdomain.com
```

