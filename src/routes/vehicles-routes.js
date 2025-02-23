const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const vehiclesController = require('../controllers/vehicles-controller');




/*
 * Routes for vehicles operations.
 */

router.post('/', authMiddleware, vehiclesController.createVehicle);
router.get('/', authMiddleware, vehiclesController.getVehicles);
router.get('/:licensePlate', authMiddleware, vehiclesController.getVehicle);
router.patch('/:licensePlate', authMiddleware, vehiclesController.updateVehicle);
router.delete('/:licensePlate', authMiddleware, vehiclesController.deleteVehicle);




module.exports = router;
