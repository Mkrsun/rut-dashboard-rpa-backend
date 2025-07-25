# 🚀 Quick Start Guide

## Prerequisites

1. **Node.js**: Version 18+ (recommended)
2. **MongoDB**: Local installation or MongoDB Atlas connection

## MongoDB Setup

### Option 1: Local MongoDB Installation

**macOS (using Homebrew):**
```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Verify MongoDB is running
brew services list | grep mongodb
```

**Ubuntu/Debian:**
```bash
# Install MongoDB
sudo apt update
sudo apt install -y mongodb

# Start MongoDB service
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Verify MongoDB is running
sudo systemctl status mongodb
```

### Option 2: Using Docker

```bash
# Run MongoDB in Docker
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:latest

# Update .env file with Docker MongoDB connection
MONGODB_URI=mongodb://admin:password@localhost:27017/rut-dashboard?authSource=admin
```

### Option 3: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Get your connection string
4. Update your `.env` file:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rut-dashboard?retryWrites=true&w=majority
   ```

## Project Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment configuration:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your settings:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/rut-dashboard
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRES_IN=24h
   CORS_ORIGIN=http://localhost:3000
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Verify the server is running:**
   ```bash
   curl http://localhost:3000/health
   ```

   Expected response:
   ```json
   {
     "success": true,
     "message": "Server is running successfully",
     "data": {
       "status": "OK",
       "timestamp": "2024-01-01T00:00:00.000Z",
       "environment": "development",
       "version": "1.0.0"
     }
   }
   ```

## Default Admin Account

The application automatically creates a default Super Admin:
- **Email**: `admin@rutdashboard.com`
- **Password**: `admin123456`

⚠️ **Change this password after first login!**

## Testing the API

### 1. Login as admin
```bash
curl -X POST http://localhost:3000/api/v1/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@rutdashboard.com",
    "password": "admin123456"
  }'
```

### 2. Use the token from login response
```bash
# Replace YOUR_JWT_TOKEN with the token from login response
export TOKEN="YOUR_JWT_TOKEN"

# Get admin profile
curl -X GET http://localhost:3000/api/v1/admin/profile \
  -H "Authorization: Bearer $TOKEN"

# Create a RUT result
curl -X POST http://localhost:3000/api/v1/rut-results \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "rut": "12345678-9",
    "data": {
      "name": "Juan Pérez",
      "status": "active",
      "company": "Example Corp"
    }
  }'
```

## Production Build

```bash
# Build the project
npm run build

# Start production server
npm start
```

## Common Issues

### 1. MongoDB Connection Error
```
❌ Failed to connect to database: MongoNetworkError
```
**Solution**: Ensure MongoDB is running and the connection string in `.env` is correct.

### 2. Port Already in Use
```
❌ Error: listen EADDRINUSE: address already in use :::3000
```
**Solution**: Change the PORT in `.env` file or kill the process using port 3000:
```bash
lsof -ti:3000 | xargs kill -9
```

### 3. JWT Secret Warning
```
⚠️ Please change the default password after first login!
```
**Solution**: This is normal. Change the JWT_SECRET in `.env` for production.

## API Documentation

### Admin Endpoints
- `POST /api/v1/admin/login` - Login
- `GET /api/v1/admin/profile` - Get profile
- `GET /api/v1/admin` - List all admins (requires admin role)
- `POST /api/v1/admin` - Create admin (requires super admin role)

### RUT Results Endpoints
- `POST /api/v1/rut-results` - Create result
- `GET /api/v1/rut-results/my-results` - Get your results
- `GET /api/v1/rut-results` - Get all results (admin only)
- `GET /api/v1/rut-results/search?q=12345678` - Search results

For complete API documentation, see [README.md](./README.md).

## Support

If you encounter any issues:
1. Check MongoDB is running
2. Verify environment variables in `.env`
3. Check the server logs for detailed error messages
4. Ensure all dependencies are installed with `npm install`

---

Happy coding! 🎉
