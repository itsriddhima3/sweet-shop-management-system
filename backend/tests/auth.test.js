import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import User from '../models/User.js';

// Test database setup
beforeAll(async () => {
  // Connect to test database
  const testDbUri = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/sweet-shop-test';
  await mongoose.connect(testDbUri);
});

// Clean up before each test
beforeEach(async () => {
  await User.deleteMany({});
});

// Close database connection after all tests
afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe('Auth API', () => {
  describe('POST /api/auth/register', () => {
    const validUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };

    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(validUser);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user.username).toBe(validUser.username);
      expect(res.body.user.email).toBe(validUser.email);
      expect(res.body.user.role).toBe('user'); // Default role
      expect(res.body.user).not.toHaveProperty('password'); // Password should not be returned
    });

    it('should register an admin user when role is specified', async () => {
      const adminUser = {
        ...validUser,
        role: 'admin'
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(adminUser);

      expect(res.status).toBe(201);
      expect(res.body.user.role).toBe('admin');
    });

    it('should return 400 if username is missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 if email is missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: 'password123'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 if password is missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 if password is too short', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: '12345' // Less than 6 characters
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('6 characters');
    });

    it('should return 400 if email is already registered', async () => {
      // Register first user
      await request(app)
        .post('/api/auth/register')
        .send(validUser);

      // Try to register with same email
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'differentuser',
          email: validUser.email, // Same email
          password: 'password123'
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('already exists');
    });

    it('should return 400 if username is already taken', async () => {
      // Register first user
      await request(app)
        .post('/api/auth/register')
        .send(validUser);

      // Try to register with same username
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: validUser.username, // Same username
          email: 'different@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('already exists');
    });

    it('should hash the password before saving', async () => {
      await request(app)
        .post('/api/auth/register')
        .send(validUser);

      const user = await User.findOne({ email: validUser.email }).select('+password');
      expect(user.password).not.toBe(validUser.password); // Password should be hashed
      expect(user.password.length).toBeGreaterThan(20); // Bcrypt hash is long
    });
  });

  describe('POST /api/auth/login', () => {
    const validUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };

    beforeEach(async () => {
      // Register a user for login tests
      await request(app)
        .post('/api/auth/register')
        .send(validUser);
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: validUser.email,
          password: validUser.password
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.email).toBe(validUser.email);
      expect(res.body.user).not.toHaveProperty('password');
    });

    it('should return 400 if email is missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          password: validUser.password
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 if password is missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: validUser.email
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 401 with invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@example.com',
          password: validUser.password
        });

      expect(res.status).toBe(401);
      expect(res.body.error).toContain('Invalid credentials');
    });

    it('should return 401 with invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: validUser.email,
          password: 'wrongpassword'
        });

      expect(res.status).toBe(401);
      expect(res.body.error).toContain('Invalid credentials');
    });

    it('should return a valid JWT token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: validUser.email,
          password: validUser.password
        });

      expect(res.body.token).toBeDefined();
      expect(typeof res.body.token).toBe('string');
      expect(res.body.token.split('.').length).toBe(3); // JWT has 3 parts
    });

    it('should include user role in response', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: validUser.email,
          password: validUser.password
        });

      expect(res.body.user).toHaveProperty('role');
      expect(res.body.user.role).toBe('user');
    });
  });

  describe('GET /api/auth/me', () => {
    let token;
    const validUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };

    beforeEach(async () => {
      // Register and login to get token
      const res = await request(app)
        .post('/api/auth/register')
        .send(validUser);
      
      token = res.body.token;
    });

    it('should get current user with valid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.email).toBe(validUser.email);
      expect(res.body.user).not.toHaveProperty('password');
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .get('/api/auth/me');

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 401 with invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalidtoken123');

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 401 with malformed Authorization header', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', token); // Missing "Bearer " prefix

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('Password Security', () => {
    it('should not return password in any response', async () => {
      const userData = {
        username: 'secureuser',
        email: 'secure@example.com',
        password: 'securepass123'
      };

      // Register
      const registerRes = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(registerRes.body.user).not.toHaveProperty('password');

      // Login
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        });

      expect(loginRes.body.user).not.toHaveProperty('password');

      // Get current user
      const meRes = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${loginRes.body.token}`);

      expect(meRes.body.user).not.toHaveProperty('password');
    });

    it('should store passwords as bcrypt hashes', async () => {
      const userData = {
        username: 'hashtest',
        email: 'hash@example.com',
        password: 'password123'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData);

      const user = await User.findOne({ email: userData.email }).select('+password');
      
      // Bcrypt hashes start with $2a$, $2b$, or $2y$
      expect(user.password).toMatch(/^\$2[aby]\$/);
      expect(user.password).not.toBe(userData.password);
    });
  });
});