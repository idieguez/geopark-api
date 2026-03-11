const express = require('express');

const { authMiddleware } = require('../middlewares/auth-middleware');
const { createVehicle, getVehicles, getVehicle, updateVehicle, deleteVehicle } = require('../controllers/vehicles-controller');
const { validateCreateVehicle, validateGetVehicle, validateUpdateVehicle, validateDeleteVehicle } = require('../middlewares/validations/vehicles-validation-middleware');




/*
 * Router creation.
 */

const router = express.Router();

router.use(authMiddleware); // All routes require to be logged in.




/*
 * Routes for vehicles operations.
 */

router.post('/', validateCreateVehicle, createVehicle);
router.get('/', getVehicles);
router.get('/:licensePlate', validateGetVehicle, getVehicle);
router.patch('/:licensePlate', validateUpdateVehicle, updateVehicle);
router.delete('/:licensePlate', validateDeleteVehicle, deleteVehicle);




/*
 * Export of routers.
 */

module.exports = { router };
