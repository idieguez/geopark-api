const express = require('express');
const { authMiddleware } = require('../middlewares/auth-middleware');
const { createVehicle, getVehicles, getVehicle, updateVehicle, deleteVehicle } = require('../controllers/vehicles-controller');




/*
 * Router creation.
 */

exports.router = express.Router();
const router = exports.router;




/*
 * Routes for vehicles operations.
 */

router.post('/', authMiddleware, createVehicle);
router.get('/', authMiddleware, getVehicles);
router.get('/:licensePlate', authMiddleware, getVehicle);
router.patch('/:licensePlate', authMiddleware, updateVehicle);
router.delete('/:licensePlate', authMiddleware, deleteVehicle);
