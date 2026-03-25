const { validateSchema } = require('../validation-middleware');
const { updateUserSchema, updatePasswordSchema, deleteAccountSchema } = require('../../schemas/users-schema');




/*
 * Middleware to validate users.
 */

exports.validateUpdateUser = validateSchema(updateUserSchema);
exports.validateUpdatePassword = validateSchema(updatePasswordSchema);
exports.validateDeleteAccount = validateSchema(deleteAccountSchema);
