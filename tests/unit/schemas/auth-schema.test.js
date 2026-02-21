// Import the schema to be tested.
const { registerSchema, loginSchema } = require('../../../src/schemas/auth-schema');




// Test suite for auth-schema - registerSchema.
describe('Test suite for auth-schema - registerSchema.', () => {

    // Case 1: the happy path.
    test('It must properly validate a user with valid data.', () => {

        const input = {
            body: {
                name: 'John',
                surname: 'Doe',
                email: 'john@example.com',
                password: 'Password123!',
                newsletter: true
            }
        };

        const result = registerSchema.safeParse(input); // "safeParse" returns an object with { success: true/false, data/error }
        expect(result.success).toBe(true); // "expect" is the statement. If this is not "true", the test fails.

    });


    // Case 2: invalid email.
    test('It should fail if the email is not in email format.', () => {

        const input = {
            body: {
                name: 'John',
                surname: 'Doe',
                email: 'john-no-tiene-email', // <--
                password: 'Password123!',
                newsletter: true
            }
        };

        const result = registerSchema.safeParse(input);
        expect(result.success).toBe(false);

    });


    // Case 3: weak password.
    test('It should fail if the password does not meet the security requirements.', () => {

        const input = {
            body: {
                name: 'John',
                surname: 'Doe',
                email: 'john@example.com',
                password: '123', // <--
                newsletter: true
            }
        };

        const result = registerSchema.safeParse(input);
        expect(result.success).toBe(false);

    });


    // Case 4: email transformation.
    test('It must automatically convert the email to lowercase.', () => {

        const input = {
            body: {
                name: 'John',
                surname: 'Doe',
                email: 'JOHN@example.com', // <--
                password: 'Password123!',
                newsletter: true
            }
        };

        const result = registerSchema.safeParse(input);
        expect(result.success).toBe(true);
        expect(result.data.body.email).toBe('john@example.com'); // Verify the transformation.

    });


    // Case 5: optional second surname.
    test('It must convert empty secondSurname ("") to null.', () => {

        const input = {
            body: {
                name: 'John',
                surname: 'Doe',
                email: 'john@example.com',
                password: 'Password123!',
                newsletter: true,
                secondSurname: "" // <--
            }
        };

        const result = registerSchema.safeParse(input);
        expect(result.success).toBe(true);
        expect(result.data.body.secondSurname).toBeNull();

    });


    // Case 6: regex validation in name.
    test('It should fail if the name contains numbers.', () => {

        const input = {
            body: {
                name: 'John2', // <--
                surname: 'Doe',
                email: 'john@example.com',
                password: 'Password123!',
                newsletter: true
            }
        };

        const result = registerSchema.safeParse(input);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toContain('Name cannot contain numbers');

    });


    // Case 7: sanitization (trim).
    test('It must remove the spaces at the beginning and end of the name.', () => {

        const input = {
            body: {
                name: '  John  ', // <--
                surname: 'Doe',
                email: 'john@example.com',
                password: 'Password123!',
                newsletter: true
            }
        };

        const result = registerSchema.safeParse(input);
        expect(result.success).toBe(true);
        expect(result.data.body.name).toBe('John');

    });


    // Case 8: password without special character.
    test('It should fail if the password does not contain a special character.', () => {

        const input = {
            body: {
                name: 'John',
                surname: 'Doe',
                email: 'john@example.com',
                password: 'Password123', // <--
                newsletter: true
            }
        };

        const result = registerSchema.safeParse(input);
        expect(result.success).toBe(false);
        
    });


    // Case 9: password with spaces.
    test('It should fail if the password contains spaces.', () => {

        const input = {
            body: {
                name: 'John',
                surname: 'Doe',
                email: 'john@example.com',
                password: 'Password 123!', // <--
                newsletter: true
            }
        };

        const result = registerSchema.safeParse(input);
        expect(result.success).toBe(false);

    });


    // Case 10: notes transformation.
    test('It must convert empty notes to null.', () => {

        const input = {
            body: {
                name: 'John',
                surname: 'Doe',
                email: 'john@example.com',
                password: 'Password123!',
                newsletter: true,
                notes: "" // <--
            }
        };

        const result = registerSchema.safeParse(input);
        expect(result.success).toBe(true);
        expect(result.data.body.notes).toBeNull();

    });


    // Case 11: incorrect data type.
    test('It should fail if newsletter is not a real boolean.', () => {

        const input = {
            body: {
                name: 'John',
                surname: 'Doe',
                email: 'john@example.com',
                password: 'Password123!',
                newsletter: "true" // <--
            }
        };

        const result = registerSchema.safeParse(input);
        expect(result.success).toBe(false);
        
    });


    // Case 12: security (strict mode).
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

        const result = registerSchema.safeParse(input);
        expect(result.success).toBe(false);

    });


    // Case 13: default values.
    // I have configured secondSurname and notes to have .default(null) This ensures that if the frontend doesn't send
    // these fields, the API automatically converts them to null, preventing them from being left as undefined.
    // This is done to maintain consistency in the database.
    test('It should automatically assign null if the optional fields are not submitted.', () => {

        const input = {
            body: {
                name: 'John',
                surname: 'Doe',
                email: 'john@example.com',
                password: 'Password123!',
                newsletter: true
                // secondSurname and notes are intentionally missing.
            }
        };

        const result = registerSchema.safeParse(input);
        expect(result.success).toBe(true);
        expect(result.data.body.secondSurname).toBeNull();
        expect(result.data.body.notes).toBeNull();

    });


    // Case 14: character limit (max length).
    test('It should fail if the name exceeds 50 characters.', () => {

        // const veryLongName = 'a'.repeat(51); // It generates 51 characters 'a'.
        const veryLongName = 'abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz'; // It generates a very long name (greater than 50 characters).
        
        const input = {
            body: {
                name: veryLongName, // <--
                surname: 'Doe',
                email: 'john@example.com',
                password: 'Password123!',
                newsletter: true
            }
        };

        const result = registerSchema.safeParse(input);
        expect(result.success).toBe(false);
        
    });

});




// Test suite for auth-schema - loginSchema.
describe('Test suite for auth-schema - loginSchema.', () => {

    // Case 1: the happy path.
    test('It must properly validate a login with valid credentials.', () => {

        const input = {
            body: {
                email: 'john@example.com',
                password: 'Password123!'
            }
        };

        const result = loginSchema.safeParse(input);
        expect(result.success).toBe(true);

    });


    // Case 2: invalid email.
    test('It should fail if the email is not in email format.', () => {

        const input = {
            body: {
                email: 'john-no-tiene-email', // <--
                password: 'Password123!'
            }
        };

        const result = loginSchema.safeParse(input);
        expect(result.success).toBe(false);

    });


    // Case 3: email transformation.
    test('It must automatically convert the email to lowercase.', () => {

        const input = {
            body: {
                email: 'JOHN@example.com', // <--
                password: 'Password123!'
            }
        };

        const result = loginSchema.safeParse(input);
        expect(result.success).toBe(true);
        expect(result.data.body.email).toBe('john@example.com'); // Verify the transformation.

    });


    // Case 4: security (strict mode).
    // My scheme uses .strict() at the end. This is very important for security, because if a hacker tries to sneak in
    // an isAdmin: true or role: "admin" field within the body, the validation must reject it.
    test('It should fail if fields not defined in the schema are sent (e.g., isAdmin).', () => {

        const input = {
            body: {
                email: 'john@example.com',
                password: 'Password123!',
                isAdmin: true // <--
            }
        };

        const result = loginSchema.safeParse(input);
        expect(result.success).toBe(false);

    });


    // Case 5: password length validation.
    test('It should fail if password is too short.', () => {

        const input = {
            body: {
                email: 'john@example.com',
                password: 'P123!'
            }
        };

        const result = loginSchema.safeParse(input);
        expect(result.success).toBe(false);
        
    });

});
