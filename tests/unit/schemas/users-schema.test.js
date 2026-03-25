// Import the schema to be tested.
const { updateUserSchema, updatePasswordSchema, deleteAccountSchema } = require('../../../src/schemas/users-schema');




// Test suite for users-schema - updateUserSchema.
describe('Test suite for users-schema - updateUserSchema.', () => {

    // Case 1: the happy path, partial update valid.
    test('It must allow updating only the name.', () => {

        const input = {
            body: {
                name: 'Luis'
            }
        };

        const result = updateUserSchema.safeParse(input); // "safeParse" returns an object with { success: true/false, data/error }
        expect(result.success).toBe(true); // "expect" is the statement. If this is not "true", the test fails.

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
                    appearance: 'blue-theme' // <--
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
                email: 'luis@example.com' // <--
            }
        };

        const result = updateUserSchema.safeParse(input);
        expect(result.success).toBe(false);

    });


    // Case 5: password without special character.
    test('It should fail if the password does not contain a special character.', () => {

        const input = {
            body: {
                password: 'Password123' // <--
            }
        };

        const result = updateUserSchema.safeParse(input);
        expect(result.success).toBe(false);
        
    });


    // Case 6: password with spaces.
    test('It should fail if the password contains spaces.', () => {

        const input = {
            body: {
                password: 'Password 123!' // <--
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
                name: 'John',
                surname: 'Doe',
                email: 'john@example.com',
                password: 'Password123!',
                newsletter: true,
                isAdmin: true // <--
            }
        };

        const result = updateUserSchema.safeParse(input);
        expect(result.success).toBe(false);

    });

});




// Test suite for users-schema - updatePasswordSchema.
describe('Test suite for users-schema - updatePasswordSchema.', () => {

    // Case 1: the happy path.
    test('It must properly validate a password update request.', () => {

        const input = {
            body: {
                passwordCurrent: 'OldPassword123!',
                passwordNew: 'NewPassword123@'
            }
        };

        const result = updatePasswordSchema.safeParse(input);
        expect(result.success).toBe(true);

    });


    // Case 2: missing current password.
    test('It should fail if the current password is missing.', () => {

        const input = {
            body: {
                passwordNew: 'NewPassword123@' // <-- passwordCurrent is missing
            }
        };

        const result = updatePasswordSchema.safeParse(input);
        expect(result.success).toBe(false);

    });


    // Case 3: weak new password.
    test('It should fail if the new password does not contain a special character.', () => {

        const input = {
            body: {
                passwordCurrent: 'OldPassword123!',
                passwordNew: 'NewPassword123' // <-- No special character
            }
        };

        const result = updatePasswordSchema.safeParse(input);
        expect(result.success).toBe(false);

    });


    // Case 4: security (strict mode).
    test('It should fail if forbidden fields are sent (e.g., passwordConfirm or isAdmin).', () => {

        const input = {
            body: {
                passwordCurrent: 'OldPassword123!',
                passwordNew: 'NewPassword123@',
                passwordConfirm: 'NewPassword123@' // <-- Rejected because we decided to handle this in frontend
            }
        };

        const result = updatePasswordSchema.safeParse(input);
        expect(result.success).toBe(false);

    });

});




// Test suite for users-schema - deleteAccountSchema.
describe('Test suite for users-schema - deleteAccountSchema.', () => {

    // Case 1: the happy path.
    test('It must properly validate a delete account request.', () => {

        const input = {
            body: {
                password: 'Password123!'
            }
        };

        const result = deleteAccountSchema.safeParse(input);
        expect(result.success).toBe(true);

    });

    
    // Case 2: missing password.
    test('It should fail if the password is missing.', () => {

        const input = {
            body: {} // <-- password is missing
        };

        const result = deleteAccountSchema.safeParse(input);
        expect(result.success).toBe(false);

    });

});
