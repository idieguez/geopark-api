const request = require('supertest');
const bcrypt = require('bcrypt');

const { app } = require('../../src/app');
const { User } = require('../../src/models/User');
const { Vehicle } = require('../../src/models/Vehicle');
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


    // Case 4: Delete account and their vehicles (cascade delete).
    test('POST /api/users/delete-account/ - It should delete the authenticated user and their associated vehicles.', async () => {

        const token = await createAndLoginUser();
        
        // Pre-step: Obtain the user and create a vehicle for them to test cascade delete.
        const user = await User.findOne({ email: 'john@example.com' });
        await Vehicle.create({
            userId: user._id,
            licensePlate: '1234ABC',
            type: 'car',
            brand: 'Mercedes-Benz',
            model: 'Vito',
            notes: 'For the whole family.'
        });

        // 1. Request delete account.
        const response = await request(app)
            .post('/api/users/delete-account/')
            .set('Authorization', `Bearer ${token}`)
            .send({
                password: 'Password123!'
            });

        // 2. Verify response.
        expect(response.status).toBe(204);

        // 3. Verify DB (User must be deleted).
        const userInDb = await User.findOne({ email: 'john@example.com' });
        expect(userInDb).toBeNull();

        // 4. Verify DB (Vehicles must be deleted).
        const vehicleInDb = await Vehicle.findOne({ licensePlate: '1234ABC' });
        expect(vehicleInDb).toBeNull();

    });


    // Case 4.1: Delete account with wrong password.
    test('POST /api/users/delete-account/ - It should return 401 if the password is incorrect.', async () => {

        const token = await createAndLoginUser();

        // 1. Request delete account with wrong password.
        const response = await request(app)
            .post('/api/users/delete-account/')
            .set('Authorization', `Bearer ${token}`)
            .send({
                password: 'WrongPassword123!' // <--
            });

        // 2. Verify response.
        expect(response.status).toBe(401);
        expect(response.body.message).toContain('incorrect');

        // 3. Verify DB (User must NOT be deleted).
        const userInDb = await User.findOne({ email: 'john@example.com' });
        expect(userInDb).not.toBeNull();

    });


    // Case 5: Access without token (security).
    test('GET /api/users/ - It should return 401 if no token is provided.', async () => {

        const response = await request(app)
            .get('/api/users/'); // No auth header.

        expect(response.status).toBe(401);

    });


    // Case 6: Update password (happy path).
    test('PATCH /api/users/update-password - It should update password and return a new token.', async () => {

        const token = await createAndLoginUser(); // Password is 'Password123!'

        // 1. Request password update.
        const response = await request(app)
            .patch('/api/users/update-password')
            .set('Authorization', `Bearer ${token}`)
            .send({
                passwordCurrent: 'Password123!',
                passwordNew: 'NewSecurePass_456!'
            });

        // 2. Verify response.
        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('token'); // Must return the new JWT inside data.

        // 3. Verify DB (checking if hash changed).
        const userInDb = await User.findOne({ email: 'john@example.com' }).select('+password');
        const isMatch = await bcrypt.compare('NewSecurePass_456!', userInDb.password);
        expect(isMatch).toBe(true); // The new password must be working.

    });


    // Case 7: Update password with wrong current password.
    test('PATCH /api/users/update-password - It should return 401 if current password is wrong.', async () => {

        const token = await createAndLoginUser();

        // 1. Request password update with WRONG current password.
        const response = await request(app)
            .patch('/api/users/update-password')
            .set('Authorization', `Bearer ${token}`)
            .send({
                passwordCurrent: 'WrongCurrentPass!', // <--
                passwordNew: 'NewSecurePass_456!'
            });

        // 2. Verify response.
        expect(response.status).toBe(401);
        expect(response.body.message).toContain('incorrect');

    });


    // Case 8: Block password updates in the generic user endpoint.
    test('PATCH /api/users/ - It should return 400 if trying to update password through generic endpoint.', async () => {

        const token = await createAndLoginUser();

        // 1. Attempt to exploit the old route.
        const response = await request(app)
            .patch('/api/users/')
            .set('Authorization', `Bearer ${token}`)
            .send({
                password: 'HackerPassword123!' // <-- Trying to inject password
            });

        // 2. Verify response.
        expect(response.status).toBe(400);
        expect(response.body.message).toContain('Unrecognized key');
        expect(response.body.message).toContain('password');

    });

});
