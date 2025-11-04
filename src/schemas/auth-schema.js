const { z } = require('zod');




exports.registerSchema = z.object({

    body: z.object({

        name: z.string().trim()
            .min(1, 'Name is required')
            .max(50, 'Name cannot exceed 50 characters')
            .regex(/^[a-zA-ZÀ-ÿ\s]*$/, 'Name cannot contain numbers or special characters'),
        
        surname: z.string().trim()
            .min(1, 'Surname is required')
            .max(50, 'Surname cannot exceed 50 characters')
            .regex(/^[a-zA-ZÀ-ÿ\s]*$/, 'Surname cannot contain numbers or special characters'),
        
        secondSurname: z.string().trim()
            .max(50, 'Second surname cannot exceed 50 characters')
            .regex(/^[a-zA-ZÀ-ÿ\s]*$/, 'Second surname cannot contain numbers or special characters')
            .optional(),
        
        email: z.string().trim()
            .min(1, 'Email is required')
            .email('Invalid email format')
            .max(255, 'Email is too long')
            .transform(s => s.toLowerCase()),
        
        password: z.string()
            .min(8, 'Password must be at least 8 characters')
            .max(40, 'Password cannot exceed 40 characters')
            .regex(
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*\W)[^\s]{8,40}$/,
                'Password must contain at least one letter, one number and one special character'
            ),
        
        newsletter: z.boolean({
            required_error: 'Newsletter preference is required',
            invalid_type_error: 'Newsletter must be a boolean'
        }),
        
        notes: z.string().trim()
            .max(500, 'Notes cannot exceed 500 characters')
            .optional()
        
    }).strict()

});
