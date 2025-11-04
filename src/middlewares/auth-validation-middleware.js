const { validateSchema } = require('./validation-middleware');
const { registerSchema } = require('../schemas/auth-schema');




/*
 * Authentication specific validations
 */

exports.validateRegister = validateSchema(registerSchema);
