const express = require('express');
const { createVehicle, getVehiclesByUserId, getVehicleByLicensePlate, updateVehicle } = require('../controllers/vehicles-controller');
const router = express.Router();




router.post('', createVehicle);
router.get('', getVehiclesByUserId);
router.get('/:licensePlate', getVehicleByLicensePlate);
router.patch('/:licensePlate', updateVehicle);




module.exports = router;
