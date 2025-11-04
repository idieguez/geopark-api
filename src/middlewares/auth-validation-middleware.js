const { validateSchema } = require('./validation-middleware');
const { registerSchema, loginSchema } = require('../schemas/auth-schema');




/*
 * Authentication specific validations
 */

exports.validateRegister = validateSchema(registerSchema);
exports.validateLogin = validateSchema(loginSchema);
