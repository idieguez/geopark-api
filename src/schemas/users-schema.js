const { z } = require('zod');




/*
 * User update validation schema.
 */

exports.updateUserSchema = z.object({

    body: z.object({

        // Name.
        name: z.string().trim()
            .min(1, 'Name is required')
            .max(50, 'Name cannot exceed 50 characters')
            .regex(/^[a-zA-ZÀ-ÿ\s]*$/, 'Name cannot contain numbers or special characters')
            .optional(),
        
        // Surname.
        surname: z.string().trim()
            .min(1, 'Surname is required')
            .max(50, 'Surname cannot exceed 50 characters')
            .regex(/^[a-zA-ZÀ-ÿ\s]*$/, 'Surname cannot contain numbers or special characters')
            .optional(),
        
        // Second surname.
        secondSurname: z.string().trim()
            .max(50, 'Second surname cannot exceed 50 characters')
            .regex(/^[a-zA-ZÀ-ÿ\s]*$/, 'Second surname cannot contain numbers or special characters')
            .transform(value => (value === '' ? null : value))
            .nullable()
            .optional()
            .default(null),
        
        // Newsletter.
        newsletter: z.boolean({
            invalid_type_error: 'Newsletter must be a boolean'
        })
        .optional(),

        // Settings.
        settings: z.object({
            appearance: z.enum(['auto', 'light', 'dark'], {
                invalid_type_error: 'Appearance must be one of: auto, light, dark',
            })
            .optional(), 
        })
        .optional(),
        
        // Notes.
        notes: z.string().trim()
            .max(500, 'Notes cannot exceed 500 characters')
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
            required_error: 'Current password is required'
        }),

        // New password.
        passwordNew: z.string()
            .min(8, 'Password must be at least 8 characters')
            .max(40, 'Password cannot exceed 40 characters')
            .regex(
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*\W)[^\s]{8,40}$/,
                'Password must contain at least one letter, one number and one special character'
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
            required_error: 'Password is required to delete the account'
        })

    }).strict()

});
