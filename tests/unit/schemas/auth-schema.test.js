const { registerSchema } = require('../../../src/schemas/auth-schema');

describe('registerSchema', () => {

    test('should validate valid registration data', () => {
        const validData = {
            body: {
                name: 'John',
                surname: 'Doe',
                secondSurname: 'Smith',
                email: 'john.doe@example.com',
                password: 'Password123!',
                newsletter: true,
                notes: 'Test notes'
            }
        };

        const result = registerSchema.safeParse(validData);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.body.email).toBe('john.doe@example.com');
            expect(result.data.body.name).toBe('John');
        }
    });

    test('should fail with invalid email', () => {
        const invalidEmailData = {
            body: {
                name: 'John',
                surname: 'Doe',
                email: 'invalid-email',
                password: 'Password123!',
                newsletter: true
            }
        };

        const result = registerSchema.safeParse(invalidEmailData);
        expect(result.success).toBe(false);
        if (!result.success) {
            const emailError = result.error.issues.find(issue => 
                issue.path.includes('email')
            );
            expect(emailError).toBeDefined();
        }
    });

    test('should fail with password that is too short', () => {
        const shortPasswordData = {
            body: {
                name: 'John',
                surname: 'Doe',
                email: 'john.doe@example.com',
                password: 'Pass1!',
                newsletter: true
            }
        };

        const result = registerSchema.safeParse(shortPasswordData);
        expect(result.success).toBe(false);
        if (!result.success) {
            const passwordError = result.error.issues.find(issue => 
                issue.path.includes('password')
            );
            expect(passwordError).toBeDefined();
            expect(passwordError.message).toContain('at least 8 characters');
        }
    });

    test('should fail with name containing numbers', () => {
        const nameWithNumbersData = {
            body: {
                name: 'John123',
                surname: 'Doe',
                email: 'john.doe@example.com',
                password: 'Password123!',
                newsletter: true
            }
        };

        const result = registerSchema.safeParse(nameWithNumbersData);
        expect(result.success).toBe(false);
        if (!result.success) {
            const nameError = result.error.issues.find(issue => 
                issue.path.includes('name')
            );
            expect(nameError).toBeDefined();
            expect(nameError.message).toContain('cannot contain numbers');
        }
    });

});
