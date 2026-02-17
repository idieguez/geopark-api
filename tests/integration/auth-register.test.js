const request = require('supertest');
const { app } = require('../../src/app');
const { User } = require('../../src/models/User');
const dbHandler = require('../db-handler');




// Test suite lifecycle configuration.
beforeAll(async () => await dbHandler.connect());
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());




// Integration test suite for POST /api/auth/register.
describe('Integration test suite for POST /api/auth/register.', () => {

    // Case 1: successful registration (happy path).
    test('It should register a new user and hash the password.', async () => {

        // Test data.
        const userData = {
            name: 'Israel',
            surname: 'Diéguez',
            email: 'israel@example.com',
            password: 'Password123!',
            newsletter: true
        };

        // 1. Send HTTP request.
        const response = await request(app)
            .post('/api/auth/register')
            .send(userData);

        // 2. Verify HTTP response.
        expect(response.status).toBe(201);
        expect(response.body.data.email).toBe('israel@example.com');
        expect(response.body.data).not.toHaveProperty('password'); // Security check: do not return password.

        // 3. Verify Database.
        const userInDb = await User.findOne({ email: 'israel@example.com' }).select('+password');
        expect(userInDb).toBeTruthy(); // It must exist.
        expect(userInDb.name).toBe('Israel');
        expect(userInDb.password).not.toBe('Password123!'); // It must be hashed.
        expect(userInDb.password).toMatch(/^\$2b\$/); // Bcrypt hashes start with $2b$.

    });


    // Case 2: duplicate email (uniqueness).
    test('It should return 409 if email is already registered.', async () => {

        // Pre-step: Create a user directly in the DB.
        const existingUser = new User({
            name: 'Israel',
            surname: 'Diéguez',
            email: 'israel@example.com',
            password: 'Password123!',
            newsletter: true
        });
        await existingUser.save();

        // Attempt to register the same email.
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Israel',
                surname: 'Martín',
                email: 'israel@example.com',
                password: 'Password123!',
                newsletter: true
            });

        expect(response.status).toBe(409);
        expect(response.body.message).toContain('already registered');

    });


    // Case 3: validation failure (Zod integration).
    // This verifies that the Zod middleware is intercepting calls before reaching the controller.
    test('It should return 400 if data is invalid (e.g. bad email).', async () => {

        const response = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Israel',
                surname: 'Diéguez',
                email: 'israel-no-tiene-email', // <--
                password: 'Password123!',
                newsletter: true
            });

        expect(response.status).toBe(400);

    });

});
