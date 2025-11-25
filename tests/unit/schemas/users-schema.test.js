// Import the schema to be tested.
const { updateUserSchema } = require('../../../src/schemas/users-schema');




// Test suite for users-schema - updateUserSchema.
describe('Test suite for users-schema - updateUserSchema.', () => {

    // Case 1: the happy path, partial update valid.
    test('It must allow updating only the name.', () => {

        const input = {
            body: {
                name: 'Luis'
            }
        };

        const result = updateUserSchema.safeParse(input);                   // "safeParse" returns an object with { success: true/false, data/error }
        expect(result.success).toBe(true);                                  // "expect" is the statement. If this is not "true", the test fails.

    });


    // Case 2: the happy path, enum validation on settings.
    test('It should accept valid appearance settings (light/dark/auto).', () => {

        const input = {
            body: {
                settings: {
                    appearance: 'dark'
                }
            }
        };

        const result = updateUserSchema.safeParse(input);
        expect(result.success).toBe(true);

    });


    // Case 3: invalid settings.
    test('It should fail if appearance is not a valid option.', () => {

        const input = {
            body: {
                settings: {
                    appearance: 'blue-theme'                                // <--
                }
            }
        };

        const result = updateUserSchema.safeParse(input);
        expect(result.success).toBe(false);

    });


    // Case 4: attempting to update a forbidden field (email is not in the schema, so updating it is not allowed).
    test('It should fail if trying to update the email (forbidden field).', () => {

        const input = {
            body: {
                email: 'luis@example.com'                                   // <--
            }
        };

        const result = updateUserSchema.safeParse(input);
        expect(result.success).toBe(false);

    });


    // Case 5: password without special character.
    test('It should fail if the password does not contain a special character.', () => {

        const input = {
            body: {
                password: 'Password123'                                     // <--
            }
        };

        const result = updateUserSchema.safeParse(input);
        expect(result.success).toBe(false);
        
    });


    // Case 6: password with spaces.
    test('It should fail if the password contains spaces.', () => {

        const input = {
            body: {
                password: 'Password 123!'                                   // <--
            }
        };

        const result = updateUserSchema.safeParse(input);
        expect(result.success).toBe(false);

    });


    // Case 7: security (strict mode).
    // My scheme uses .strict() at the end. This is very important for security, because if a hacker tries to sneak in
    // an isAdmin: true or role: "admin" field within the body, the validation must reject it.
    test('It should fail if fields not defined in the schema are sent (e.g., isAdmin).', () => {

        const input = {
            body: {
                name: 'Israel',
                surname: 'Diéguez',
                email: 'israel@example.com',
                password: 'Password123!',
                newsletter: true,
                isAdmin: true                                               // <--
            }
        };

        const result = updateUserSchema.safeParse(input);
        expect(result.success).toBe(false);

    });

});
