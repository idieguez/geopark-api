const { z } = require('zod');




/*
 * Vehicle creation validation schema.
 */

exports.createVehicleSchema = z.object({

    body: z.object({

        // License plate.
        licensePlate: z.string().trim()
            .min(7, 'License plate must have 7 characters')
            .max(7, 'License plate must have 7 characters')
            .regex(/^\d{4}[a-zA-Z]{3}$/, 'License plate must be 4 numbers followed by 3 letters with no spaces in between (e.g., 1234ABC)')
            .transform(s => s.toUpperCase()),
        
        // Type.
        type: z.enum(['car', 'motorbike'], {
            required_error: 'Vehicle type is required',
            invalid_type_error: 'Vehicle type must be "car" or "motorbike"'
        }),
        
        // Brand.
        brand: z.string().trim()
            .min(1, 'Vehicle brand is required')
            .max(50, 'Vehicle brand cannot exceed 50 characters'),
        
        // Model.
        model: z.string().trim()
            .min(1, 'Vehicle model is required')
            .max(50, 'Vehicle model cannot exceed 50 characters'),
        
        // Notes.
        notes: z.string().trim()
            .max(500, 'Notes cannot exceed 500 characters')
            .transform(value => (value === '' ? null : value))
            .nullable()
            .optional()
            .default(null)
        
    }).strict()

});




/*
 * Vehicle get validation schema.
 */

exports.getVehicleSchema = z.object({

    params: z.object({

        // License plate.
        licensePlate: z.string().trim()
            .min(7, 'License plate must have 7 characters')
            .max(7, 'License plate must have 7 characters')
            .regex(/^\d{4}[a-zA-Z]{3}$/, 'License plate must be 4 numbers followed by 3 letters with no spaces in between (e.g., 1234ABC)')
            .transform(s => s.toUpperCase())

    }).strict()

});




/*
 * Vehicle update validation schema.
 */

exports.updateVehicleSchema = z.object({

    // Route params.
    params: z.object({

        // License plate.
        licensePlate: z.string().trim()
            .min(7, 'License plate must have 7 characters')
            .max(7, 'License plate must have 7 characters')
            .regex(/^\d{4}[a-zA-Z]{3}$/, 'License plate must be 4 numbers followed by 3 letters with no spaces in between (e.g., 1234ABC)')
            .transform(s => s.toUpperCase())

    }).strict(),

    // Body.
    body: z.object({

        // Type.
        type: z.enum(['car', 'motorbike'], {
            invalid_type_error: 'Vehicle type must be "car" or "motorbike"'
        })
        .optional(),
        
        // Brand.
        brand: z.string().trim()
            .min(1, 'Vehicle brand cannot be empty')
            .max(50, 'Vehicle brand cannot exceed 50 characters')
            .optional(),
        
        // Model.
        model: z.string().trim()
            .min(1, 'Vehicle model cannot be empty')
            .max(50, 'Vehicle model cannot exceed 50 characters')
            .optional(),

        // Location.
        location: z.object({
            
            latitude: z.number({
                invalid_type_error: 'Latitude must be a number',
                required_error: 'Latitude is required if location is sent'
            }).min(-90, 'Latitude must be between -90 and 90')
              .max(90, 'Latitude must be between -90 and 90'),
            
            longitude: z.number({
                invalid_type_error: 'Longitude must be a number',
                required_error: 'Longitude is required if location is sent'
            }).min(-180, 'Longitude must be between -180 and 180')
              .max(180, 'Longitude must be between -180 and 180'),

        })
        .strict()
        .optional(),
        
        // Notes.
        notes: z.string().trim()
            .max(500, 'Notes cannot exceed 500 characters')
            .transform(value => (value === '' ? null : value))
            .nullable()
            .optional()
            .default(null)

    }).strict()

});




/*
 * Vehicle deletion validation schema.
 */

exports.deleteVehicleSchema = z.object({

    params: z.object({

        // License plate.
        licensePlate: z.string().trim()
            .min(7, 'License plate must have 7 characters')
            .max(7, 'License plate must have 7 characters')
            .regex(/^\d{4}[a-zA-Z]{3}$/, 'License plate must be 4 numbers followed by 3 letters with no spaces in between (e.g., 1234ABC)')
            .transform(s => s.toUpperCase())

    }).strict()

});
