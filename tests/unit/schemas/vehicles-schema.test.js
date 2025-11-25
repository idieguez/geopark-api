// Import the schemas to be tested.
const { createVehicleSchema, getVehicleSchema, updateVehicleSchema, deleteVehicleSchema } = require('../../../src/schemas/vehicles-schema');




// Test suite for vehicles-schema - createVehicleSchema.
describe('Test suite for vehicles-schema - createVehicleSchema.', () => {

    // Case 1: the happy path.
    test('It must allow creating a valid vehicle (car).', () => {

        const input = {
            body: {
                licensePlate: '1234abc',                                    // Lowercase input to test transformation.
                type: 'car',
                brand: 'Mercedes-Benz',
                model: 'Vito',
                notes: 'For the whole family.'
            }
        };

        const result = createVehicleSchema.safeParse(input);
        expect(result.success).toBe(true);
        expect(result.data.body.licensePlate).toBe('1234ABC');              // Check uppercase transform.

    });


    // Case 2: invalid license plate format.
    test('It should fail if license plate format is invalid (e.g., spaces or wrong pattern).', () => {

        const invalidPlates = ['1234 A', '12ABC34', '12345AB', 'ABCD123'];
        invalidPlates.forEach(plate => {

            const input = {
                body: {
                    licensePlate: plate,
                    type: 'car',
                    brand: 'Mercedes-Benz',
                    model: 'Vito'
                }
            };
            const result = createVehicleSchema.safeParse(input);
            expect(result.success).toBe(false);

        });

    });


    // Case 3: invalid vehicle type (enum).
    test('It should fail if vehicle type is unknown (e.g., truck).', () => {

        const input = {
            body: {
                licensePlate: '1234ABC',
                type: 'truck',                                              // <--
                brand: 'Mercedes-Benz',
                model: 'Vito'
            }
        };

        const result = createVehicleSchema.safeParse(input);
        expect(result.success).toBe(false);

    });


    // Case 4: empty brand (min length).
    test('It should fail if brand is empty.', () => {

        const input = {
            body: {
                licensePlate: '1234ABC',
                type: 'car',
                brand: '',                                                  // <--
                model: 'Vito'
            }
        };

        const result = createVehicleSchema.safeParse(input);
        expect(result.success).toBe(false);

    });


    // Case 5: empty model (min length).
    test('It should fail if model is empty.', () => {

        const input = {
            body: {
                licensePlate: '1234ABC',
                type: 'car',
                brand: 'Mercedes-Benz',
                model: ''                                                   // <--
            }
        };

        const result = createVehicleSchema.safeParse(input);
        expect(result.success).toBe(false);

    });

});




// Test suite for vehicles-schema - getVehicleSchema.
describe('Test suite for vehicles-schema - getVehicleSchema.', () => {

    // Case 1: happy path with transformation.
    test('It must validate license plate in URL params correctly and transform to uppercase.', () => {

        const input = {
            params: {
                licensePlate: '1234abc'                                     // Lowercase.
            }
        };
        
        const result = getVehicleSchema.safeParse(input);
        expect(result.success).toBe(true);
        expect(result.data.params.licensePlate).toBe('1234ABC');            // Uppercase.

    });


    // Case 2: invalid license plate format.
    test('It should fail if license plate format is invalid in params.', () => {

        const input = {
            params: {
                licensePlate: 'INVALID'
            }
        };

        const result = getVehicleSchema.safeParse(input);
        expect(result.success).toBe(false);

    });

});




// Test suite for vehicles-schema - updateVehicleSchema.
describe('Test suite for vehicles-schema - updateVehicleSchema.', () => {

    // Case 1: happy path, partial update.
    test('It must allow updating only the brand (partial update).', () => {

        const input = {
            params: {
                licensePlate: '1234ABC'
            },
            body: {
                brand: 'Mazda'
            }
        };

        const result = updateVehicleSchema.safeParse(input);
        expect(result.success).toBe(true);

    });


    // Case 2: invalid license plate format in params.
    test('It should fail if license plate format is invalid in params.', () => {

        const input = {
            params: {
                licensePlate: 'NO-VALID'
            },
            body: {
                brand: 'Volkswagen'
            }
        };

        const result = updateVehicleSchema.safeParse(input);
        expect(result.success).toBe(false);

    });


    // Case 3: location validation (out of range).
    test('It should fail if latitude/longitude are out of range.', () => {

        const input = {
            params: {
                licensePlate: '1234ABC'
            },
            body: {
                location: {
                    latitude: 100,                                          // Max is 90.
                    longitude: -200                                         // Min is -180.
                }
            }
        };

        const result = updateVehicleSchema.safeParse(input);
        expect(result.success).toBe(false);

    });


    // Case 4: correct location coordinates.
    test('It must validate correct location coordinates.', () => {

        const input = {
            params: {
                licensePlate: '1234ABC'
            },
            body: {
                location: {
                    latitude: 37.3887285348106,
                    longitude: -5.994544222471149
                }
            }
        };

        const result = updateVehicleSchema.safeParse(input);
        expect(result.success).toBe(true);

    });


    // Case 5: forbidden update check.
    test('It should fail if trying to update the license plate in the body (forbidden).', () => {

        const input = {
            params: {
                licensePlate: '1234ABC'
            },
            body: {
                licensePlate: '9999NEW'
            }
        };

        const result = updateVehicleSchema.safeParse(input);
        expect(result.success).toBe(false);

    });

});




// Test suite for vehicles-schema - deleteVehicleSchema.
describe('Test suite for vehicles-schema - deleteVehicleSchema.', () => {

    // Case 1: happy path.
    test('It must validate license plate in URL params correctly.', () => {

        const input = {
            params: {
                licensePlate: '1234ABC'
            }
        };

        const result = deleteVehicleSchema.safeParse(input);
        expect(result.success).toBe(true);

    });


    // Case 2: invalid license plate format.
    test('It should fail if license plate format is invalid in params.', () => {

        const input = {
            params: {
                licensePlate: 'NO-VALID'
            }
        };

        const result = deleteVehicleSchema.safeParse(input);
        expect(result.success).toBe(false);

    });


    // Case 3: security check (strict mode).
    test('It should fail if params contain extra fields.', () => {

        const input = {
            params: {
                licensePlate: '1234ABC',
                id: '123'                                                   // <--
            }
        };

        const result = deleteVehicleSchema.safeParse(input);
        expect(result.success).toBe(false);

    });

});
