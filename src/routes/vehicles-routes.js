const express = require('express');
const { authMiddleware } = require('../middlewares/auth-middleware');
const { createVehicle, getVehicles, getVehicle, updateVehicle, deleteVehicle } = require('../controllers/vehicles-controller');
const { validateCreateVehicle, validateGetVehicle, validateUpdateVehicle, validateDeleteVehicle } = require('../middlewares/validations/vehicles-validation-middleware');




/*
 * Router creation.
 */

exports.router = express.Router();
const router = exports.router;




/*
 * Routes for vehicles operations.
 */

router.post('/', authMiddleware, validateCreateVehicle, createVehicle);
router.get('/', authMiddleware, getVehicles);
router.get('/:licensePlate', authMiddleware, validateGetVehicle, getVehicle);
router.patch('/:licensePlate', authMiddleware, validateUpdateVehicle, updateVehicle);
router.delete('/:licensePlate', authMiddleware, validateDeleteVehicle, deleteVehicle);
