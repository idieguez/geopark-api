const { validateSchema } = require('../validation-middleware');
const { createVehicleSchema, getVehicleSchema, updateVehicleSchema, deleteVehicleSchema } = require('../../schemas/vehicles-schema');




/*
 * Middleware to validate vehicles.
 */

exports.validateCreateVehicle = validateSchema(createVehicleSchema);
exports.validateGetVehicle = validateSchema(getVehicleSchema);
exports.validateUpdateVehicle = validateSchema(updateVehicleSchema);
exports.validateDeleteVehicle = validateSchema(deleteVehicleSchema);
