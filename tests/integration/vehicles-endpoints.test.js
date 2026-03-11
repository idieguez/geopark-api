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




// Integration test suite for Vehicle endpoints (/api/vehicles).
describe('Integration test suite for Vehicle endpoints (/api/vehicles).', () => {

    // Helper function to create a user and get a valid token.
    const createAndLoginUser = async () => {

        const hashedPassword = await bcrypt.hash('Password123!', 10);
        const pastDate = new Date(Date.now() - 60000);

        await User.create({
            name: 'John',
            surname: 'Doe',
            email: 'john@example.com',
            password: hashedPassword,
            newsletter: true,
            dateLastPasswordModification: pastDate
        });

        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'john@example.com',
                password: 'Password123!'
            });
        
        return loginResponse.body.data.token;
    };


    // Case 1: Create a new vehicle (happy path).
    test('POST /api/vehicles/ - It should create a new vehicle for the authenticated user.', async () => {

        const token = await createAndLoginUser();

        // 1. Request create vehicle.
        const response = await request(app)
            .post('/api/vehicles/')
            .set('Authorization', `Bearer ${token}`)
            .send({
                licensePlate: '1234ABC',
                type: 'car',
                brand: 'Mercedes-Benz',
                model: 'Vito',
                notes: 'For the whole family.'
            });

        // 2. Verify response.
        expect(response.status).toBe(201);
        expect(response.body.data.licensePlate).toBe('1234ABC');
        expect(response.body.data.brand).toBe('Mercedes-Benz');

        // 3. Verify DB persistence.
        const vehicleInDb = await Vehicle.findOne({ licensePlate: '1234ABC' });
        expect(vehicleInDb).toBeTruthy();
        expect(vehicleInDb.userId).toBeTruthy();

    });


    // Case 2: Get all vehicles (happy path).
    test('GET /api/vehicles/ - It should return a list of user vehicles.', async () => {

        const token = await createAndLoginUser();
        const user = await User.findOne({ email: 'john@example.com' });

        // Pre-step: Create two vehicles directly in DB.
        await Vehicle.create([
            { userId: user._id, licensePlate: '1111AAA', type: 'car', brand: 'Opel', model: 'Insignia' },
            { userId: user._id, licensePlate: '2222BBB', type: 'car', brand: 'Volkswagen', model: 'Polo' }
        ]);

        // 1. Request list.
        const response = await request(app)
            .get('/api/vehicles/')
            .set('Authorization', `Bearer ${token}`);

        // 2. Verify response.
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBe(2);

    });


    // Case 3: Get a single vehicle (happy path).
    test('GET /api/vehicles/:licensePlate - It should return the vehicle details.', async () => {

        const token = await createAndLoginUser();
        const user = await User.findOne({ email: 'john@example.com' });

        // Pre-step: Create vehicle.
        await Vehicle.create({
            userId: user._id,
            licensePlate: '1234ABC',
            type: 'car',
            brand: 'Mercedes-Benz',
            model: 'Vito',
            notes: 'For the whole family.'
        });

        // 1. Request vehicle details.
        const response = await request(app)
            .get('/api/vehicles/1234ABC')
            .set('Authorization', `Bearer ${token}`);

        // 2. Verify response.
        expect(response.status).toBe(200);
        expect(response.body.data.licensePlate).toBe('1234ABC');
        expect(response.body.data.model).toBe('Vito');

    });


    // Case 4: Update vehicle (happy path).
    test('PATCH /api/vehicles/:licensePlate - It should update vehicle details.', async () => {

        const token = await createAndLoginUser();
        const user = await User.findOne({ email: 'john@example.com' });

        // Pre-step: Create vehicle.
        await Vehicle.create({
            userId: user._id,
            licensePlate: '1234ABC',
            type: 'car',
            brand: 'Mercedes-Benz',
            model: 'Vito',
            notes: 'For the whole family (original notes).'
        });

        // 1. Request update.
        const response = await request(app)
            .patch('/api/vehicles/1234ABC')
            .set('Authorization', `Bearer ${token}`)
            .send({
                notes: 'For the whole family (updated notes).'
            });

        // 2. Verify response.
        expect(response.status).toBe(200);
        expect(response.body.data.notes).toBe('For the whole family (updated notes).');

        // 3. Verify DB.
        const updatedVehicle = await Vehicle.findOne({ licensePlate: '1234ABC' });
        expect(updatedVehicle.notes).toBe('For the whole family (updated notes).');

    });


    // Case 5: Delete vehicle (happy path).
    test('DELETE /api/vehicles/:licensePlate - It should delete the vehicle.', async () => {

        const token = await createAndLoginUser();
        const user = await User.findOne({ email: 'john@example.com' });

        // Pre-step: Create vehicle.
        await Vehicle.create({
            userId: user._id,
            licensePlate: '1234ABC',
            type: 'car',
            brand: 'Mercedes-Benz',
            model: 'Vito'
        });

        // 1. Request delete.
        const response = await request(app)
            .delete('/api/vehicles/1234ABC')
            .set('Authorization', `Bearer ${token}`);

        // 2. Verify response.
        expect(response.status).toBe(204);

        // 3. Verify DB.
        const vehicleInDb = await Vehicle.findOne({ licensePlate: '1234ABC' });
        expect(vehicleInDb).toBeNull();

    });


    // Case 6: Create duplicate vehicle (business rule).
    test('POST /api/vehicles/ - It should return 409 if license plate already exists.', async () => {

        const token = await createAndLoginUser();
        const user = await User.findOne({ email: 'john@example.com' });

        // Pre-step: Create vehicle.
        await Vehicle.create({
            userId: user._id,
            licensePlate: '1234ABC',
            type: 'car',
            brand: 'Mercedes-Benz',
            model: 'Vito'
        });

        // 1. Attempt to create same license plate.
        const response = await request(app)
            .post('/api/vehicles/')
            .set('Authorization', `Bearer ${token}`)
            .send({
                licensePlate: '1234ABC',
                type: 'car',
                brand: 'Mercedes-Benz',
                model: 'Vito'
            });

        expect(response.status).toBe(409);
        expect(response.body.message).toContain('already exists');

    });


    // Case 7: Get non-existent vehicle (not found).
    test('GET /api/vehicles/:licensePlate - It should return 404 if vehicle does not exist.', async () => {

        const token = await createAndLoginUser();

        const response = await request(app)
            .get('/api/vehicles/9999ZZZ')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toContain('not found');

    });


    // Case 8: Update forbidden fields (security).
    test('PATCH /api/vehicles/:licensePlate - It should not allow updating licensePlate or userId.', async () => {

        const token = await createAndLoginUser();
        const user = await User.findOne({ email: 'john@example.com' });

        // Pre-step: create vehicle.
        await Vehicle.create({
            userId: user._id,
            licensePlate: '1234FIX',
            type: 'car',
            brand: 'Fixed',
            model: 'Car'
        });

        // 1. Attempt to hijack owner or change license plate.
        const response = await request(app)
            .patch('/api/vehicles/1234FIX')
            .set('Authorization', `Bearer ${token}`)
            .send({
                licensePlate: '9999HACK', // Forbidden.
                userId: '507f1f77bcf86cd799439011' // Forbidden (Random ID).
            });

        // 2. Verify response (expect 400 due to Zod "Unrecognized key" or specific validation).
        expect(response.status).toBe(400);

        // 3. Verify DB integrity (critical).
        const vehicleInDb = await Vehicle.findOne({ licensePlate: '1234FIX' });
        expect(vehicleInDb).toBeTruthy(); // License plate didn't change.
        expect(vehicleInDb.userId.toString()).toBe(user._id.toString()); // Owner didn't change.

    });

});
