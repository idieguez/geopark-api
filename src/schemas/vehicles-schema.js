const { z } = require('zod');




/*
 * Reusable constants.
 */

const licensePlateValidation = z.string().trim()
    .length(7, 'ERR_VALID_LICENSE_PLATE_LENGTH|License plate must have exactly 7 characters')
    .regex(/^\d{4}[a-zA-Z]{3}$/, 'ERR_VALID_LICENSE_PLATE_FORMAT|Format must be 4 numbers followed by 3 letters (e.g., 1234ABC)')
    .transform(s => s.toUpperCase());




/*
 * Vehicle creation validation schema.
 */

exports.createVehicleSchema = z.object({

    body: z.object({

        // License plate.
        licensePlate: licensePlateValidation,
        
        // Type.
        type: z.enum(['car', 'motorbike'], {
            required_error: 'ERR_VALID_VEHICLE_TYPE_REQUIRED|Vehicle type is required',
            invalid_type_error: 'ERR_VALID_VEHICLE_TYPE_INVALID|Vehicle type must be "car" or "motorbike"'
        }),
        
        // Brand.
        brand: z.string().trim()
            .min(1, 'ERR_VALID_VEHICLE_BRAND_REQUIRED|Vehicle brand is required')
            .max(50, 'ERR_VALID_VEHICLE_BRAND_MAX_LENGTH|Vehicle brand cannot exceed 50 characters'),
        
        // Model.
        model: z.string().trim()
            .min(1, 'ERR_VALID_VEHICLE_MODEL_REQUIRED|Vehicle model is required')
            .max(50, 'ERR_VALID_VEHICLE_MODEL_MAX_LENGTH|Vehicle model cannot exceed 50 characters'),
        
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
 * Vehicle get validation schema.
 */

exports.getVehicleSchema = z.object({

    params: z.object({

        // License plate.
        licensePlate: licensePlateValidation

    }).strict()

});




/*
 * Vehicle update validation schema.
 */

exports.updateVehicleSchema = z.object({

    // Route params.
    params: z.object({

        // License plate.
        licensePlate: licensePlateValidation

    }).strict(),

    // Body.
    body: z.object({

        // Type.
        type: z.enum(['car', 'motorbike'], {
            invalid_type_error: 'ERR_VALID_VEHICLE_TYPE_INVALID|Vehicle type must be "car" or "motorbike"'
        })
        .optional(),
        
        // Brand.
        brand: z.string().trim()
            .min(1, 'ERR_VALID_VEHICLE_BRAND_REQUIRED|Vehicle brand cannot be empty')
            .max(50, 'ERR_VALID_VEHICLE_BRAND_MAX_LENGTH|Vehicle brand cannot exceed 50 characters')
            .optional(),
        
        // Model.
        model: z.string().trim()
            .min(1, 'ERR_VALID_VEHICLE_MODEL_REQUIRED|Vehicle model cannot be empty')
            .max(50, 'ERR_VALID_VEHICLE_MODEL_MAX_LENGTH|Vehicle model cannot exceed 50 characters')
            .optional(),

        // Location.
        location: z.object({
            
            latitude: z.number({
                invalid_type_error: 'ERR_VALID_LATITUDE_INVALID_TYPE|Latitude must be a number',
                required_error: 'ERR_VALID_LATITUDE_REQUIRED|Latitude is required if location is sent'
            }).min(-90, 'ERR_VALID_LATITUDE_OUT_OF_RANGE|Latitude must be between -90 and 90')
              .max(90, 'ERR_VALID_LATITUDE_OUT_OF_RANGE|Latitude must be between -90 and 90'),
            
            longitude: z.number({
                invalid_type_error: 'ERR_VALID_LONGITUDE_INVALID_TYPE|Longitude must be a number',
                required_error: 'ERR_VALID_LONGITUDE_REQUIRED|Longitude is required if location is sent'
            }).min(-180, 'ERR_VALID_LONGITUDE_OUT_OF_RANGE|Longitude must be between -180 and 180')
              .max(180, 'ERR_VALID_LONGITUDE_OUT_OF_RANGE|Longitude must be between -180 and 180'),

        })
        .strict()
        .nullable()
        .optional(),
        
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
 * Vehicle deletion validation schema.
 */

exports.deleteVehicleSchema = z.object({

    params: z.object({

        // License plate.
        licensePlate: licensePlateValidation

    }).strict()

});
