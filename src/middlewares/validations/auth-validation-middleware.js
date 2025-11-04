const { validateSchema } = require('../validation-middleware');
const { registerSchema, loginSchema } = require('../../schemas/auth-schema');




/*
 * Middleware to validate authentication.
 */

exports.validateRegister = validateSchema(registerSchema);
exports.validateLogin = validateSchema(loginSchema);
