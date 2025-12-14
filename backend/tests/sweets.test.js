import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import app from '../server.js';
import Sweet from '../models/Sweet.js';
import User from '../models/User.js';

let userToken;
let adminToken;
let userId;
let adminId;

// Test database setup
beforeAll(async () => {
  const testDbUri = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/sweet-shop-test';
  await mongoose.connect(testDbUri);

  // Create test user
  const user = await User.create({
    username: 'testuser',
    email: 'user@test.com',
    password: 'password123',
    role: 'user'
  });
  userId = user._id;
  userToken = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );

  // Create test admin
  const admin = await User.create({
    username: 'admin',
    email: 'admin@test.com',
    password: 'admin123',
    role: 'admin'
  });
  adminId = admin._id;
  adminToken = jwt.sign(
    { id: admin._id, email: admin.email, role: admin.role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
});

// Clean up sweets before each test
beforeEach(async () => {
  await Sweet.deleteMany({});
});

// Close database connection after all tests
afterAll(async () => {
  await User.deleteMany({});
  await Sweet.deleteMany({});
  await mongoose.connection.close();
});

describe('Sweets API', () => {
  describe('GET /api/sweets', () => {
    it('should return all sweets when authenticated', async () => {
      // Create test sweets
      await Sweet.create([
        { name: 'Chocolate Bar', category: 'chocolate', price: 2.99, quantity: 10 },
        { name: 'Gummy Bears', category: 'gummy', price: 1.99, quantity: 20 }
      ]);

      const res = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('sweets');
      expect(res.body.sweets).toHaveLength(2);
      expect(res.body.sweets[0]).toHaveProperty('name');
      expect(res.body.sweets[0]).toHaveProperty('price');
      expect(res.body.sweets[0]).toHaveProperty('quantity');
    });

    it('should return 401 without authentication', async () => {
      const res = await request(app).get('/api/sweets');
      expect(res.status).toBe(401);
    });

    it('should return empty array when no sweets exist', async () => {
      const res = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.sweets).toHaveLength(0);
    });

    it('should return sweets sorted by creation date (newest first)', async () => {
      await Sweet.create({ name: 'First', category: 'candy', price: 1.00, quantity: 5 });
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
      await Sweet.create({ name: 'Second', category: 'candy', price: 1.00, quantity: 5 });

      const res = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.body.sweets[0].name).toBe('Second');
      expect(res.body.sweets[1].name).toBe('First');
    });
  });

  describe('POST /api/sweets', () => {
    const validSweet = {
      name: 'Lollipop',
      category: 'lollipop',
      price: 0.99,
      quantity: 50,
      description: 'Delicious lollipop'
    };

    it('should create sweet when admin authenticated', async () => {
      const res = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(validSweet);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('sweet');
      expect(res.body.sweet.name).toBe(validSweet.name);
      expect(res.body.sweet.price).toBe(validSweet.price);
      expect(res.body.sweet.quantity).toBe(validSweet.quantity);
    });

    it('should return 403 when non-admin tries to create', async () => {
      const res = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send(validSweet);

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 401 without authentication', async () => {
      const res = await request(app)
        .post('/api/sweets')
        .send(validSweet);

      expect(res.status).toBe(401);
    });

    it('should return 400 when name is missing', async () => {
      const res = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          category: 'candy',
          price: 1.99,
          quantity: 10
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('required');
    });

    it('should return 400 when category is missing', async () => {
      const res = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Sweet',
          price: 1.99,
          quantity: 10
        });

      expect(res.status).toBe(400);
    });

    it('should return 400 when price is missing', async () => {
      const res = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Sweet',
          category: 'candy',
          quantity: 10
        });

      expect(res.status).toBe(400);
    });

    it('should return 400 when quantity is missing', async () => {
      const res = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Sweet',
          category: 'candy',
          price: 1.99
        });

      expect(res.status).toBe(400);
    });

    it('should return 400 when price is negative', async () => {
      const res = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          ...validSweet,
          price: -1.99
        });

      expect(res.status).toBe(400);
    });

    it('should return 400 when quantity is negative', async () => {
      const res = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          ...validSweet,
          quantity: -10
        });

      expect(res.status).toBe(400);
    });

    it('should create sweet with optional fields', async () => {
      const sweetWithOptionals = {
        ...validSweet,
        imageUrl: 'https://example.com/image.jpg',
        featured: true
      };

      const res = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sweetWithOptionals);

      expect(res.status).toBe(201);
      expect(res.body.sweet.imageUrl).toBe(sweetWithOptionals.imageUrl);
    });
  });

  describe('PUT /api/sweets/:id', () => {
    let sweetId;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Original Sweet',
        category: 'candy',
        price: 2.99,
        quantity: 10
      });
      sweetId = sweet._id;
    });

    it('should update sweet when admin authenticated', async () => {
      const updates = {
        name: 'Updated Sweet',
        price: 3.99
      };

      const res = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updates);

      expect(res.status).toBe(200);
      expect(res.body.sweet.name).toBe(updates.name);
      expect(res.body.sweet.price).toBe(updates.price);
    });

    it('should return 403 when non-admin tries to update', async () => {
      const res = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Updated' });

      expect(res.status).toBe(403);
    });

    it('should return 404 when sweet not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/sweets/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated' });

      expect(res.status).toBe(404);
    });

    it('should return 400 when trying to set negative price', async () => {
      const res = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price: -5.99 });

      expect(res.status).toBe(400);
    });

    it('should return 400 when trying to set negative quantity', async () => {
      const res = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: -5 });

      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/sweets/:id', () => {
    let sweetId;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'To Be Deleted',
        category: 'candy',
        price: 1.99,
        quantity: 5
      });
      sweetId = sweet._id;
    });

    it('should delete sweet when admin authenticated', async () => {
      const res = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message');

      // Verify deletion
      const sweet = await Sweet.findById(sweetId);
      expect(sweet).toBeNull();
    });

    it('should return 403 when non-admin tries to delete', async () => {
      const res = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);

      // Verify sweet still exists
      const sweet = await Sweet.findById(sweetId);
      expect(sweet).not.toBeNull();
    });

    it('should return 404 when sweet not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .delete(`/api/sweets/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/sweets/:id/purchase', () => {
    let sweetId;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Chocolate Bar',
        category: 'chocolate',
        price: 3.99,
        quantity: 5
      });
      sweetId = sweet._id;
    });

    it('should decrease quantity when purchasing', async () => {
      const res = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.remainingQuantity).toBe(4);

      // Verify in database
      const sweet = await Sweet.findById(sweetId);
      expect(sweet.quantity).toBe(4);
    });

    it('should return 400 when out of stock', async () => {
      // Create out of stock sweet
      const outOfStockSweet = await Sweet.create({
        name: 'Sold Out',
        category: 'candy',
        price: 1.99,
        quantity: 0
      });

      const res = await request(app)
        .post(`/api/sweets/${outOfStockSweet._id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('out of stock');
    });

    it('should return 404 when sweet not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .post(`/api/sweets/${fakeId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(404);
    });

    it('should allow multiple purchases until out of stock', async () => {
      // Purchase 5 times (until stock is 0)
      for (let i = 0; i < 5; i++) {
        const res = await request(app)
          .post(`/api/sweets/${sweetId}/purchase`)
          .set('Authorization', `Bearer ${userToken}`);
        
        expect(res.status).toBe(200);
      }

      // 6th purchase should fail
      const res = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(400);
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`);

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/sweets/:id/restock', () => {
    let sweetId;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Low Stock Sweet',
        category: 'candy',
        price: 2.49,
        quantity: 2
      });
      sweetId = sweet._id;
    });

    it('should increase quantity when admin restocks', async () => {
      const res = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 10 });

      expect(res.status).toBe(200);
      expect(res.body.newQuantity).toBe(12);

      // Verify in database
      const sweet = await Sweet.findById(sweetId);
      expect(sweet.quantity).toBe(12);
    });

    it('should return 403 when non-admin tries to restock', async () => {
      const res = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 10 });

      expect(res.status).toBe(403);

      // Verify quantity unchanged
      const sweet = await Sweet.findById(sweetId);
      expect(sweet.quantity).toBe(2);
    });

    it('should return 400 when quantity is missing', async () => {
      const res = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});

      expect(res.status).toBe(400);
    });

    it('should return 400 when quantity is zero or negative', async () => {
      const res1 = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 0 });

      expect(res1.status).toBe(400);

      const res2 = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: -5 });

      expect(res2.status).toBe(400);
    });

    it('should return 404 when sweet not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .post(`/api/sweets/${fakeId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 10 });

      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/sweets/search', () => {
    beforeEach(async () => {
      await Sweet.create([
        { name: 'Dark Chocolate', category: 'chocolate', price: 4.99, quantity: 10 },
        { name: 'Milk Chocolate', category: 'chocolate', price: 3.99, quantity: 15 },
        { name: 'Gummy Worms', category: 'gummy', price: 2.49, quantity: 20 },
        { name: 'Sour Patch Kids', category: 'sour', price: 3.49, quantity: 0 }
      ]);
    });

    it('should search by name (case insensitive)', async () => {
      const res = await request(app)
        .get('/api/sweets/search')
        .query({ name: 'chocolate' })
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.sweets).toHaveLength(2);
      expect(res.body.sweets.every(s => s.name.toLowerCase().includes('chocolate'))).toBe(true);
    });

    it('should search by category', async () => {
      const res = await request(app)
        .get('/api/sweets/search')
        .query({ category: 'gummy' })
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.sweets).toHaveLength(1);
      expect(res.body.sweets[0].name).toBe('Gummy Worms');
    });

    it('should search by price range (min)', async () => {
      const res = await request(app)
        .get('/api/sweets/search')
        .query({ minPrice: 4 })
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.sweets).toHaveLength(1);
      expect(res.body.sweets[0].name).toBe('Dark Chocolate');
    });

    it('should search by price range (max)', async () => {
      const res = await request(app)
        .get('/api/sweets/search')
        .query({ maxPrice: 3 })
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.sweets).toHaveLength(1);
      expect(res.body.sweets[0].name).toBe('Gummy Worms');
    });

    it('should search by price range (min and max)', async () => {
      const res = await request(app)
        .get('/api/sweets/search')
        .query({ minPrice: 3, maxPrice: 5 })
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.sweets).toHaveLength(3);
    });

    it('should combine multiple search filters', async () => {
      const res = await request(app)
        .get('/api/sweets/search')
        .query({ 
          category: 'chocolate',
          minPrice: 4,
          maxPrice: 5 
        })
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.sweets).toHaveLength(1);
      expect(res.body.sweets[0].name).toBe('Dark Chocolate');
    });

    it('should return count of results', async () => {
      const res = await request(app)
        .get('/api/sweets/search')
        .query({ category: 'chocolate' })
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.count).toBe(2);
    });

    it('should return empty array when no matches found', async () => {
      const res = await request(app)
        .get('/api/sweets/search')
        .query({ name: 'nonexistent' })
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.sweets).toHaveLength(0);
      expect(res.body.count).toBe(0);
    });
  });
});