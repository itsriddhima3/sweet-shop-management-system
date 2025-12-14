# 🍬 Sweet Shop Management System

A full-stack e-commerce application for managing and purchasing sweets, built following Test-Driven Development (TDD) practices and leveraging modern AI tools for enhanced productivity.

## 📖 Project Overview

This Sweet Shop Management System is a comprehensive web application that allows users to browse, search, and purchase sweets, while administrators can manage inventory and sweet listings. The project was developed as part of the TDD Kata challenge, emphasizing clean code, test coverage, and modern development practices.

### Key Features
- 🔐 Secure user authentication with JWT
- 📧 Email verification with OTP
- 🔑 Password reset functionality
- 🍭 Browse and search sweet inventory
- 🛒 Purchase sweets with real-time quantity updates
- 👨‍💼 Admin dashboard for inventory management
- 📱 Responsive design for all devices

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database for data persistence
- **JWT** - Token-based authentication
- **bcrypt.js** - Password hashing for security
- **Nodemailer** - Email service for OTP delivery
- **SMTP** - Email protocol configuration

### Frontend
- **React** - UI framework
- **Vite** - Build tool and development server
- **Modern CSS** - Responsive styling

### Testing
- **Jest** - Testing framework
- **Supertest** - API endpoint testing
- **MongoDB Memory Server** - In-memory database for tests

## 🤖 My AI Usage

As required by the kata guidelines, here is a detailed account of how AI tools were integrated into this project:

### AI Tools Used

1. **Claude (Anthropic)**
   - Primary AI assistant for the project
   - Used extensively throughout development

2. **GitHub Copilot**
   - Code completion and suggestions
   - Error resolution and debugging

### How I Used AI

#### 🎨 Frontend Development
- **Claude** helped design the entire frontend architecture
- Generated React component boilerplate and structure
- Assisted with responsive design implementation
- Created user authentication flows and forms

#### 🔧 Backend Development
- **Claude** generated initial route structure for authentication and sweet management
- Helped write controller logic for all endpoints
- Assisted in implementing JWT authentication middleware
- Created email verification and password reset logic using Nodemailer

#### 🐛 Debugging & Error Resolution
- **GitHub Copilot** provided real-time suggestions for fixing errors
- Helped resolve dependency conflicts
- Suggested better error handling patterns
- Assisted with MongoDB connection issues

#### 📝 Documentation
- **Claude** helped structure and write this comprehensive README
- Generated API documentation sections
- Created clear installation instructions

### My Reflection on AI Impact

Using AI tools significantly accelerated my development workflow while maintaining code quality:

**Positive Impacts:**
- **Speed:** Reduced boilerplate writing time by ~60%, allowing more focus on business logic
- **Learning:** Exposed me to best practices and patterns I hadn't considered
- **Debugging:** Faster error resolution with contextual suggestions
- **Documentation:** More comprehensive and professional documentation

**Challenges & Learnings:**
- Required careful review of AI-generated code to ensure it met project requirements
- Sometimes AI suggestions needed modification to fit the specific architecture
- Important to understand the code rather than blindly accepting suggestions
- Balancing AI assistance with personal problem-solving skills

**Key Takeaway:** AI tools are powerful accelerators, but critical thinking and understanding remain essential. I used AI as a collaborative partner, not a replacement for learning.

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- Brevo (formerly Sendinblue) account for SMTP email service
- npm or yarn package manager
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd sweet-shop-management
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the backend directory:
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   
   # Database (MongoDB Atlas)
   MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/database-name
   
   # CORS Configuration
   CORS_ORIGIN=*
   
   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here
   
   # Email Configuration (Brevo/Sendinblue SMTP)
   SMTP_HOST=smtp-relay.brevo.com
   SMTP_PORT=587
   SMTP_USER=your_brevo_smtp_user
   SMTP_PASSWORD=your_brevo_smtp_password
   SENDER_EMAIL=your_email@gmail.com
   ```

4. **Start MongoDB**
   
   Using MongoDB Atlas (cloud database):
   - No local setup needed
   - Ensure your IP address is whitelisted in MongoDB Atlas
   - Connection string is already configured in `.env`

5. **Run the backend server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

   The backend will run on `http://localhost:3000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the frontend directory:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

4. **Run the frontend application**
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173`

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Run tests with coverage
npm run test:coverage

# Frontend tests (if implemented)
cd frontend
npm test
```

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Logout
```http
POST /api/auth/logout
```

#### Send Verification OTP
```http
POST /api/auth/send-verify-otp
Authorization: Bearer <token>
```

#### Verify Email
```http
POST /api/auth/verify-account
Authorization: Bearer <token>
Content-Type: application/json

{
  "otp": "123456"
}
```

#### Check Authentication Status
```http
POST /api/auth/is-authenticated
Authorization: Bearer <token>
```

#### Send Password Reset OTP
```http
POST /api/auth/send-reset-otp
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "NewSecurePass123!"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Sweet Management Endpoints

#### Get All Sweets
```http
GET /api/sweets
```

#### Search Sweets
```http
GET /api/sweets/search?query=chocolate&category=candy&minPrice=10&maxPrice=50
Authorization: Bearer <token>
```

#### Purchase Sweet
```http
POST /api/sweets/:id/purchase
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 2
}
```

#### Create Sweet (Admin Only)
```http
POST /api/sweets
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Chocolate Bar",
  "category": "Chocolate",
  "price": 25.99,
  "quantity": 100,
  "description": "Delicious milk chocolate"
}
```

#### Update Sweet (Admin Only)
```http
PUT /api/sweets/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "price": 29.99,
  "quantity": 150
}
```

#### Delete Sweet (Admin Only)
```http
DELETE /api/sweets/:id
Authorization: Bearer <admin-token>
```

#### Restock Sweet (Admin Only)
```http
POST /api/sweets/:id/restock
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "quantity": 50
}
```

## 📁 Project Structure

```
sweet-shop-management/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── sweetsController.js
│   ├── models/
│   │   ├── User.js
│   │   └── Sweet.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── sweetRoutes.js
│   ├── middleware/
│   │   ├── userAuth.js
│   │   ├── adminAuth.js
│   │   └── errorHandler.js
│   ├── config/
│   │   ├── database.js
│   │   └── email.js
│   ├── utils/
│   │   ├── mailer.js
│   │   └── tokenGenerator.js
│   ├── tests/
│   │   ├── auth.test.js
│   │   └── sweets.test.js
│   ├── .env
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── .env
│   └── package.json
└── README.md
```

## 🧪 Test Coverage

The project follows Test-Driven Development (TDD) principles with comprehensive test coverage:

- **Authentication Tests:** User registration, login, email verification, password reset
- **Sweet Management Tests:** CRUD operations, search functionality, purchase logic
- **Middleware Tests:** Authentication and authorization checks
- **Integration Tests:** End-to-end API workflows

### Running Test Report
```bash
cd backend
npm run test:coverage
```

This will generate a detailed coverage report showing test results for all modules.

## 📸 Application Screenshots

### Homepage - Browse Sweets
![Homepage](./screenshots/homepage.png)
*Browse through available sweets with search and filter options*

### User Registration
![Registration](./screenshots/registration.png)
*Secure user registration with email verification*

### Sweet Details & Purchase
![Sweet Details](./screenshots/sweet-details.png)
*View sweet details and purchase with real-time quantity updates*

### Admin Dashboard
![Admin Dashboard](./screenshots/admin-dashboard.png)
*Admin interface for managing inventory and sweet listings*

## 🚢 Deployment

### Backend Deployment (Render/Railway)
1. Create a new web service
2. Connect your GitHub repository
3. Set environment variables
4. Deploy

### Frontend Deployment (Vercel/Netlify)
1. Import project from GitHub
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_URL`
5. Deploy

### Live Application
🌐 **[View Live Demo](#)** *(Add your deployment link here)*

## 🔒 Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT token-based authentication
- Protected routes with middleware
- Role-based access control (User/Admin)
- Email verification for new accounts
- Secure password reset with OTP
- Input validation and sanitization

## 🤝 Contributing

While this is a kata project, feedback and suggestions are welcome:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit changes with AI co-authorship if applicable
4. Push to the branch
5. Open a Pull Request

## 📝 Git Commit Convention

Following the kata requirements, commits using AI assistance include co-authorship:

```bash
git commit -m "feat: Implement user authentication

Used Claude to generate JWT middleware and token validation logic.
Manually added custom error handling.

Co-authored-by: Claude <ai@anthropic.com>"
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: itsriddhima3
- Email: riddhima3007@gmail.com

## 🙏 Acknowledgments

- **Anthropic (Claude)** for AI-assisted development and problem-solving
- **GitHub Copilot** for code completion and error resolution
- The open-source community for excellent libraries and tools
- TDD Kata challenge for the project structure and requirements

---

**Built with ❤️ and AI assistance**
