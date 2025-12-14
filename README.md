🍬 Sweet Shop Management System

A full-stack Sweet Shop Management System developed as part of a TDD Kata, showcasing backend API development, authentication, inventory management, frontend integration, testing, and responsible AI-assisted development.

📌 Project Overview

This application allows users to register, log in, verify their email, reset passwords, browse sweets, search/filter items, and purchase sweets.
Admin users can manage inventory by adding, updating, restocking, and deleting sweets.

The project follows:

RESTful API design

JWT-based authentication & authorization

Test-Driven Development (TDD)

Clean code and modern development practices

🛠️ Tech Stack
Backend

Node.js

Express.js

MongoDB (Mongoose)

JWT – Authentication & authorization

bcrypt.js – Password hashing

Nodemailer – Email & OTP services

Jest – Unit and integration testing

Frontend

React (Vite.js)

Single Page Application (SPA)

Responsive UI

Development & AI Tools

Git & GitHub

Claude AI

GitHub Copilot

ChatGPT

✨ Features
Authentication & User Management

User registration & login

JWT-based authentication

Email verification using OTP

Password reset using OTP

Secure logout

Fetch logged-in user profile

Sweet Management

View all available sweets

Search sweets by name, category, or price range

Purchase sweets (stock decreases automatically)

Admin Inventory Management

Add new sweets

Update sweet details

Delete sweets

Restock sweets

Role-based access control (Admin only)

🔐 Authentication & User Routes

Base Route

/api/auth

authRouter.post('/register', Register);
authRouter.post('/login', Login);
authRouter.post('/logout', Logout);

authRouter.post('/send-verify-otp', userAuth, verifyOtp);
authRouter.post('/verify-account', userAuth, verifyEmail);
authRouter.post('/is-authenticated', userAuth, isAuthenticated);

authRouter.post('/send-reset-otp', sendResetOtp);
authRouter.post('/reset-password', resetPassword);

authRouter.get('/me', userAuth, getUserData);

Middleware Used

userAuth → JWT-based authentication middleware

🍬 Sweet Routes

Base Route

/api/sweets

sweetRouter.get('/', sweetsController.getAllSweets);

sweetRouter.get('/search', userAuth, sweetsController.searchSweets);

sweetRouter.post('/:id/purchase', userAuth, sweetsController.purchaseSweet);

sweetRouter.post('/', userAuth, adminAuth, sweetsController.createSweet);
sweetRouter.put('/:id', userAuth, adminAuth, sweetsController.updateSweet);
sweetRouter.delete('/:id', userAuth, adminAuth, sweetsController.deleteSweet);

sweetRouter.post('/:id/restock', userAuth, adminAuth, sweetsController.restockSweet);

Middleware Used

userAuth → Authenticates logged-in users

adminAuth → Restricts access to admin-only operations

🛡️ Access Control Summary

Public:

View all sweets

Register, login, reset password

Authenticated Users:

Search sweets

Purchase sweets

Verify email

View own profile

Admin Users:

Create, update, delete sweets

Restock inventory

