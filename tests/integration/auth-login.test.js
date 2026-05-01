const request = require('supertest');
const bcrypt = require('bcrypt');

const { app } = require('../../src/app');
const { User } = require('../../src/models/User');
const dbHandler = require('../db-handler');




// Test suite lifecycle configuration.
beforeAll(async () => await dbHandler.connect());
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());




// Integration test suite for POST /api/auth/login.
describe('Integration test suite for POST /api/auth/login.', () => {

    // Case 1: successful login (happy path).
    test('It should login successfully and return a JWT token.', async () => {

        // Pre-step: Create a user in the DB.
        const hashedPassword = await bcrypt.hash('Password123!', 10);
        await User.create({
            name: 'Alejandro',
            surname: 'Martínez',
            email: 'alejandro@example.com',
            password: hashedPassword,
            newsletter: true
        });

        // Send login request.
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'alejandro@example.com',
                password: 'Password123!'
            });

        // Verify response.
        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('token');
        expect(response.body.data.email).toBe('alejandro@example.com');
        expect(response.body.data.name).toBe('Alejandro');

        // Optional: Verify token format (basic check).
        expect(typeof response.body.data.token).toBe('string');
        expect(response.body.data.token.split('.').length).toBe(3); // JWT has 3 parts.

    });


    // Case 2: invalid credentials (wrong password).
    test('It should return 401 if password is incorrect.', async () => {

        // Pre-step: Create a user in the DB.
        const hashedPassword = await bcrypt.hash('Password123!', 10);
        await User.create({
            name: 'Alejandro',
            surname: 'Martínez',
            email: 'alejandro@example.com',
            password: hashedPassword,
            newsletter: true
        });

        // Send login request with WRONG password.
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'alejandro@example.com',
                password: 'WrongPassword!' // <--
            });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid credentials.');

    });


    // Case 3: user not found (wrong email).
    test('It should return 401 if user does not exist.', async () => {

        // No user is created in DB for this test.

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'incorrect@example.com', // <--
                password: 'Password123!'
            });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid credentials.');

    });

});
