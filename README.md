# RUT Dashboard RPA Backend

A professional Node.js backend application built with TypeScript, Express, and MongoDB using Clean Architecture principles.

## 🏗️ Architecture

This project follows **Feature-Based Clean Architecture** with the following structure:

```
src/
├── main.ts                          # Application initialization
├── server.ts                        # Server entry point
├── shared/                          # Shared utilities and configurations
│   ├── config/                      # Environment and app configuration
│   ├── database/                    # Database connection setup
│   ├── middleware/                  # Authentication and common middleware
│   ├── types/                       # Common type definitions
│   └── utils/                       # Utility functions
└── features/                        # Feature-based modules
    ├── admin/                       # Admin management feature
    └── rutProcessResult/            # RUT process results feature
```

### Feature Structure
Each feature follows Clean Architecture layers:
- **Domain**: Entities and business rules
- **Application**: Use cases and business logic
- **Infrastructure**: External concerns (database, controllers, routes)

## 🚀 Features

### Admin Management
- User authentication with JWT tokens
- Role-based access control (Super Admin, Admin)
- CRUD operations for admin users
- Password management
- Profile management

### RUT Process Results
- Flexible data structure for RUT processing results
- CRUD operations with proper authorization
- Search and filtering capabilities
- User-specific result management
- Statistics and reporting

## 🛠️ Technologies

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, bcryptjs for password hashing
- **Development**: nodemon, ts-node

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rut-dashboard-rpa-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your configuration:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/rut-dashboard
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRES_IN=24h
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm run build
   npm start
   ```

## 🔑 Default Admin Account

The application automatically creates a default Super Admin account:
- **Email**: `admin@rutdashboard.com`
- **Password**: `admin123456`

⚠️ **Important**: Change the default password after first login!

## 📡 API Endpoints

### Health Check
- `GET /health` - Server health status

### Admin Management
- `POST /api/v1/admin/login` - Admin login
- `GET /api/v1/admin/profile` - Get current admin profile
- `PUT /api/v1/admin/change-password` - Change password
- `GET /api/v1/admin` - Get all admins (Admin+)
- `POST /api/v1/admin` - Create admin (Super Admin only)
- `GET /api/v1/admin/:id` - Get admin by ID
- `PUT /api/v1/admin/:id` - Update admin (Super Admin only)
- `DELETE /api/v1/admin/:id` - Delete admin (Super Admin only)
- `PATCH /api/v1/admin/:id/toggle-status` - Toggle admin status (Super Admin only)

### RUT Process Results
- `POST /api/v1/rut-results` - Create new result
- `GET /api/v1/rut-results` - Get all results (Admin+)
- `GET /api/v1/rut-results/my-results` - Get current user's results
- `GET /api/v1/rut-results/:id` - Get result by ID
- `PUT /api/v1/rut-results/:id` - Update result
- `DELETE /api/v1/rut-results/:id` - Delete result
- `GET /api/v1/rut-results/by-rut/:rut` - Get results by RUT
- `GET /api/v1/rut-results/search?q=term` - Search results
- `GET /api/v1/rut-results/stats` - Get result statistics

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🧪 API Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

## 🏃‍♂️ Development

### Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server

### Code Structure Guidelines
- Use TypeScript for type safety
- Follow Clean Architecture principles
- Implement proper error handling
- Use dependency injection
- Maintain consistent API responses
- Implement proper logging

## 🔒 Security Features

- Helmet.js for security headers
- CORS configuration
- Password hashing with bcryptjs
- JWT token authentication
- Request validation
- Error message sanitization
- Rate limiting ready (can be added)

## 📝 Contributing

1. Follow the existing code structure and patterns
2. Use TypeScript for all new code
3. Implement proper error handling
4. Add appropriate logging
5. Follow Clean Architecture principles
6. Update documentation for new features

## 📄 License

This project is licensed under the ISC License.

---

Built with ❤️ using Clean Architecture principles and best practices.
