const { validateSchema } = require('../validation-middleware');
const { updateUserSchema } = require('../../schemas/users-schema');




/*
 * Middleware to validate users.
 */

exports.validateUpdateUser = validateSchema(updateUserSchema);
