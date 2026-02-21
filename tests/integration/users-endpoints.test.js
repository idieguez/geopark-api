const request = require('supertest');
const bcrypt = require('bcrypt');
const { app } = require('../../src/app');
const { User } = require('../../src/models/User');
const dbHandler = require('../db-handler');




// Test suite lifecycle configuration.
beforeAll(async () => await dbHandler.connect());
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());




// Integration test suite for User endpoints (/api/users).
describe('Integration test suite for User endpoints (/api/users).', () => {

    // Helper function to create a user and get a valid token.
    const createAndLoginUser = async () => {

        // 1. Create user.
        const hashedPassword = await bcrypt.hash('Password123!', 10);
        const pastDate = new Date(Date.now() - 60000); // 1 minute ago.

        await User.create({
            name: 'John',
            surname: 'Doe',
            email: 'john@example.com',
            password: hashedPassword,
            newsletter: true,
            dateLastPasswordModification: pastDate
        });

        // 2. Login to get token.
        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'john@example.com',
                password: 'Password123!'
            });
        
        return loginResponse.body.data.token;
    };


    // Case 1: Get user profile (happy path).
    test('GET /api/users/ - It should return the authenticated user profile.', async () => {

        const token = await createAndLoginUser();

        // 1. Request profile.
        const response = await request(app)
            .get('/api/users/')
            .set('Authorization', `Bearer ${token}`); // Auth header.

        // 2. Verify response.
        expect(response.status).toBe(200);
        expect(response.body.data.email).toBe('john@example.com');
        expect(response.body.data.name).toBe('John');
        expect(response.body.data).not.toHaveProperty('password');

    });


    // Case 2: Update user profile (happy path).
    test('PATCH /api/users/ - It should update user name and surname.', async () => {

        const token = await createAndLoginUser();

        // 1. Request update.
        const response = await request(app)
            .patch('/api/users/')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'John New',
                surname: 'Doe New'
            });

        // 2. Verify response.
        expect(response.status).toBe(200);
        expect(response.body.data.name).toBe('John New');
        expect(response.body.data.surname).toBe('Doe New');

        // 3. Verify DB persistence.
        const userInDb = await User.findOne({ email: 'john@example.com' });
        expect(userInDb.name).toBe('John New');

    });


    // Case 3: Update forbidden fields (business rule).
    test('PATCH /api/users/ - It should fail when trying to update the email.', async () => {

        const token = await createAndLoginUser();

        // 1. Request update with forbidden field.
        const response = await request(app)
            .patch('/api/users/')
            .set('Authorization', `Bearer ${token}`)
            .send({
                email: 'luis@example.com' // Forbidden.
            });

        // 2. Verify response.
        expect(response.status).toBe(400);
        expect(response.body.message).toContain('Unrecognized key');
        expect(response.body.message).toContain('email');

    });


    // Case 4: Delete user (happy path).
    test('DELETE /api/users/ - It should delete the authenticated user.', async () => {

        const token = await createAndLoginUser();

        // 1. Request delete.
        const response = await request(app)
            .delete('/api/users/')
            .set('Authorization', `Bearer ${token}`);

        // 2. Verify response.
        expect(response.status).toBe(204);

        // 3. Verify DB.
        const userInDb = await User.findOne({ email: 'john@example.com' });
        expect(userInDb).toBeNull();

    });


    // Case 5: Access without token (security).
    test('GET /api/users/ - It should return 401 if no token is provided.', async () => {

        const response = await request(app)
            .get('/api/users/'); // No auth header.

        expect(response.status).toBe(401);

    });

});
