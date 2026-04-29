const { z } = require('zod');




/*
 * User update validation schema.
 */

exports.updateUserSchema = z.object({

    body: z.object({

        // Name.
        name: z.string().trim()
            .min(1, 'ERR_VALID_NAME_REQUIRED|Name is required')
            .max(50, 'ERR_VALID_NAME_MAX_LENGTH|Name cannot exceed 50 characters')
            .regex(/^[a-zA-ZÀ-ÿ\s]*$/, 'ERR_VALID_NAME_FORMAT|Name cannot contain numbers or special characters')
            .optional(),
        
        // Surname.
        surname: z.string().trim()
            .min(1, 'ERR_VALID_SURNAME_REQUIRED|Surname is required')
            .max(50, 'ERR_VALID_SURNAME_MAX_LENGTH|Surname cannot exceed 50 characters')
            .regex(/^[a-zA-ZÀ-ÿ\s]*$/, 'ERR_VALID_SURNAME_FORMAT|Surname cannot contain numbers or special characters')
            .optional(),
        
        // Second surname.
        secondSurname: z.string().trim()
            .max(50, 'ERR_VALID_SECOND_SURNAME_MAX_LENGTH|Second surname cannot exceed 50 characters')
            .regex(/^[a-zA-ZÀ-ÿ\s]*$/, 'ERR_VALID_SECOND_SURNAME_FORMAT|Second surname cannot contain numbers or special characters')
            .transform(value => (value === '' ? null : value))
            .nullable()
            .optional()
            .default(null),
        
        // Newsletter.
        newsletter: z.boolean({
            invalid_type_error: 'ERR_VALID_NEWSLETTER_INVALID_TYPE|Newsletter must be a boolean'
        })
        .optional(),

        // Settings.
        settings: z.object({
            appearance: z.enum(['auto', 'light', 'dark'], {
                invalid_type_error: 'ERR_VALID_APPEARANCE_INVALID_TYPE|Appearance must be one of: auto, light, dark',
            })
            .optional(), 
        })
        .optional(),
        
        // Notes.
        notes: z.string().trim()
            .max(500, 'ERR_VALID_NOTES_MAX_LENGTH|Notes cannot exceed 500 characters')
            .transform(value => (value === '' ? null : value))
            .nullable()
            .optional()
        
    }).strict()

});




/*
 * User update password validation schema.
 */

exports.updatePasswordSchema = z.object({

    body: z.object({

        // Current password.
        passwordCurrent: z.string({
            required_error: 'ERR_VALID_CURRENT_PASSWORD_REQUIRED|Current password is required'
        }),

        // New password.
        passwordNew: z.string()
            .min(8, 'ERR_VALID_NEW_PASSWORD_MIN_LENGTH|Password must be at least 8 characters')
            .max(40, 'ERR_VALID_NEW_PASSWORD_MAX_LENGTH|Password cannot exceed 40 characters')
            .regex(
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*\W)[^\s]{8,40}$/,
                'ERR_VALID_NEW_PASSWORD_FORMAT|Password must contain at least one letter, one number and one special character'
            )

    }).strict()

});




/*
 * User delete account validation schema.
 */

exports.deleteAccountSchema = z.object({

    body: z.object({

        // Password for confirmation.
        password: z.string({
            required_error: 'ERR_VALID_PASSWORD_REQUIRED|Password is required to delete the account'
        })

    }).strict()

});
