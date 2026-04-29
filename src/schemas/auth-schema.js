const { z } = require('zod');




/*
 * User registration validation schema.
 */

exports.registerSchema = z.object({

    body: z.object({

        // Name.
        name: z.string().trim()
            .min(1, 'ERR_VALID_NAME_REQUIRED|Name is required')
            .max(50, 'ERR_VALID_NAME_MAX_LENGTH|Name cannot exceed 50 characters')
            .regex(/^[a-zA-ZÀ-ÿ\s]*$/, 'ERR_VALID_NAME_FORMAT|Name cannot contain numbers or special characters'),
        
        // Surname.
        surname: z.string().trim()
            .min(1, 'ERR_VALID_SURNAME_REQUIRED|Surname is required')
            .max(50, 'ERR_VALID_SURNAME_MAX_LENGTH|Surname cannot exceed 50 characters')
            .regex(/^[a-zA-ZÀ-ÿ\s]*$/, 'ERR_VALID_SURNAME_FORMAT|Surname cannot contain numbers or special characters'),
        
        // Second surname.
        secondSurname: z.string().trim()
            .max(50, 'ERR_VALID_SECOND_SURNAME_MAX_LENGTH|Second surname cannot exceed 50 characters')
            .regex(/^[a-zA-ZÀ-ÿ\s]*$/, 'ERR_VALID_SECOND_SURNAME_FORMAT|Second surname cannot contain numbers or special characters')
            .transform(value => (value === '' ? null : value))
            .nullable()
            .optional()
            .default(null),
        
        // Email.
        email: z.string().trim()
            .min(1, 'ERR_VALID_EMAIL_REQUIRED|Email is required')
            .email('ERR_VALID_EMAIL_FORMAT|Invalid email format')
            .max(255, 'ERR_VALID_EMAIL_MAX_LENGTH|Email is too long')
            .transform(s => s.toLowerCase()),
        
        // Password.
        password: z.string()
            .min(8, 'ERR_VALID_PASSWORD_MIN_LENGTH|Password must be at least 8 characters')
            .max(40, 'ERR_VALID_PASSWORD_MAX_LENGTH|Password cannot exceed 40 characters')
            .regex(
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*\W)[^\s]{8,40}$/,
                'ERR_VALID_PASSWORD_FORMAT|Password must contain at least one letter, one number and one special character'
            ),
        
        // Newsletter.
        newsletter: z.boolean({
            required_error: 'ERR_VALID_NEWSLETTER_REQUIRED|Newsletter preference is required',
            invalid_type_error: 'ERR_VALID_NEWSLETTER_INVALID_TYPE|Newsletter must be a boolean'
        }),
        
        // Notes.
        notes: z.string().trim()
            .max(500, 'ERR_VALID_NOTES_MAX_LENGTH|Notes cannot exceed 500 characters')
            .transform(value => (value === '' ? null : value))
            .nullable()
            .optional()
            .default(null)
        
    }).strict()

});




/*
 * User login validation schema.
 */

exports.loginSchema = z.object({

    body: z.object({

        // Email.
        email: z.string().trim()
            .min(1, 'ERR_VALID_EMAIL_REQUIRED|Email is required')
            .email('ERR_VALID_EMAIL_FORMAT|Invalid email format')
            .max(255, 'ERR_VALID_EMAIL_MAX_LENGTH|Email is too long')
            .transform(s => s.toLowerCase()),
        
        // Password.
        password: z.string()
            .min(8, 'ERR_VALID_PASSWORD_MIN_LENGTH|Password must be at least 8 characters')
            .max(40, 'ERR_VALID_PASSWORD_MAX_LENGTH|Password cannot exceed 40 characters')

    }).strict()

});
