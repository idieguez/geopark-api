const { Vehicle } = require('../models/Vehicle');
const { AppError } = require('../utils/app-error');
const { catchAsync } = require('../utils/catch-async');




/*
 * Create a new vehicle.
 * POST /api/vehicles/
 */

exports.createVehicle = catchAsync(async (req, res, next) => {

    // Get parameters.
    const {
        licensePlate: licensePlateParam,
        type: typeParam,
        brand: brandParam,
        model: modelParam,
        notes: notesParam
    } = req.body;
    const userIdParam = req.userId; // The user id is obtained from the token (vía auth-middleware).

    // Check if the license plate already exists.
    const existingVehicle = await Vehicle.findOne({ licensePlate: licensePlateParam }).exec();
    if (existingVehicle) {
        return next(new AppError('The license plate already exists.', 409, 'ERR_VEHICLES_DUPLICATE_LICENSE_PLATE'));
    }

    // Create new vehicle.
    const vehicle = new Vehicle({
        licensePlate: licensePlateParam,
        type: typeParam,
        brand: brandParam,
        model: modelParam,
        location: { latitude: null, longitude: null },
        notes: notesParam,
        userId: userIdParam,
        dateVehicleCreation: new Date(),
        dateLastVehicleModification: new Date(),
        dateLastLocationModification: null
    });

    // Save vehicle in the database.
    await vehicle.save();

    // Return vehicle.
    res.status(201).json({
        status: 'success',
        data: {
            _id: vehicle._id,
            licensePlate: vehicle.licensePlate,
            type: vehicle.type,
            brand: vehicle.brand,
            model: vehicle.model,
            location: vehicle.location,
            notes: vehicle.notes,
            userId: vehicle.userId,
            dateVehicleCreation: vehicle.dateVehicleCreation,
            dateLastVehicleModification: vehicle.dateLastVehicleModification,
            dateLastLocationModification: vehicle.dateLastLocationModification
        }
    });

});




/*
 * Get all vehicles of a user.
 * GET /api/vehicles/
 */

exports.getVehicles = catchAsync(async (req, res, next) => {

    // Get parameters.
    const userIdParam = req.userId; // The user id is obtained from the token (vía auth-middleware).

    // Get vehicles.
    const vehicles = await Vehicle.find({ userId: userIdParam }).exec();

    // Return vehicles.
    res.status(200).json({
        status: 'success',
        results: vehicles.length,
        data: vehicles.map(vehicle => ({
            _id: vehicle._id,
            licensePlate: vehicle.licensePlate,
            type: vehicle.type,
            brand: vehicle.brand,
            model: vehicle.model,
            location: vehicle.location,
            notes: vehicle.notes,
            userId: vehicle.userId,
            dateVehicleCreation: vehicle.dateVehicleCreation,
            dateLastVehicleModification: vehicle.dateLastVehicleModification,
            dateLastLocationModification: vehicle.dateLastLocationModification
        }))
    });

});




/*
 * Get a vehicle by license plate.
 * GET /api/vehicles/:licensePlate
 */

exports.getVehicle = catchAsync(async (req, res, next) => {

    // Get parameters.
    const licensePlateParam = req.params.licensePlate;
    const userIdParam = req.userId; // The user id is obtained from the token (vía auth-middleware).
    
    // Get vehicle.
    const vehicle = await Vehicle.findOne({ licensePlate: licensePlateParam }).exec();
    if (!vehicle) {
        return next(new AppError('Vehicle not found.', 404, 'ERR_VEHICLES_NOT_FOUND'));
    }

    // Check if the user is authorized to access the vehicle.
    if (vehicle.userId.toString() !== userIdParam) {
        return next(new AppError('The user is not authorized to access this vehicle.', 403, 'ERR_VEHICLES_UNAUTHORIZED_ACCESS'));
    }

    // Return vehicle.
    res.status(200).json({
        status: 'success',
        data: {
            _id: vehicle._id,
            licensePlate: vehicle.licensePlate,
            type: vehicle.type,
            brand: vehicle.brand,
            model: vehicle.model,
            location: vehicle.location,
            notes: vehicle.notes,
            userId: vehicle.userId,
            dateVehicleCreation: vehicle.dateVehicleCreation,
            dateLastVehicleModification: vehicle.dateLastVehicleModification,
            dateLastLocationModification: vehicle.dateLastLocationModification
        }
    });

});




/*
 * Update a vehicle by license plate.
 * PATCH /api/vehicles/:licensePlate
 */

exports.updateVehicle = catchAsync(async (req, res, next) => {

    // Get parameters.
    const licensePlateParam = req.params.licensePlate;
    const userIdParam = req.userId; // The user id is obtained from the token (vía auth-middleware).
    const vehicleParam = req.body;

    // Security checks: exclude _id, licensePlate, userId and dates from updates.
    if (vehicleParam._id) {
        return next(new AppError('It is not allowed to update the vehicle id.', 400, 'ERR_VEHICLES_FORBIDDEN_UPDATE_ID'));
    }

    if (vehicleParam.licensePlate) {
        return next(new AppError('It is not allowed to update the vehicle\'s license plate.', 400, 'ERR_VEHICLES_FORBIDDEN_UPDATE_PLATE'));
    }

    if (vehicleParam.userId) {
        return next(new AppError('It is not allowed to update the user id associated with the vehicle.', 400, 'ERR_VEHICLES_FORBIDDEN_UPDATE_USER_ID'));
    }
    
    if (vehicleParam.dateVehicleCreation || vehicleParam.dateLastVehicleModification || vehicleParam.dateLastLocationModification) {
        return next(new AppError('It is not allowed to update the dates.', 400, 'ERR_VEHICLES_FORBIDDEN_UPDATE_DATES'));
    }

    // Check if the location is being updated.
    if (vehicleParam.location) {

        const lat = vehicleParam.location.latitude;
        const lon = vehicleParam.location.longitude;

        if (lat === null || lat === undefined || lat === '' ||
            lon === null || lon === undefined || lon === '') {
            
            vehicleParam.location.latitude = null;
            vehicleParam.location.longitude = null;

        } else {
            vehicleParam.dateLastLocationModification = new Date();
        }
        
    }

    // Dates update.
    vehicleParam.dateLastVehicleModification = new Date();

    // Get vehicle.
    const vehicle1 = await Vehicle.findOne({ licensePlate: licensePlateParam }).exec();
    if (!vehicle1) {
        return next(new AppError('Vehicle not found.', 404, 'ERR_VEHICLES_NOT_FOUND'));
    }

    // Check if the user is authorized to access the vehicle.
    if (vehicle1.userId.toString() !== userIdParam) {
        return next(new AppError('The user is not authorized to access this vehicle.', 403, 'ERR_VEHICLES_UNAUTHORIZED_ACCESS'));
    }

    // Update vehicle in the database.
    const vehicle2 = await Vehicle.findByIdAndUpdate(vehicle1._id, vehicleParam, {
        returnDocument: 'after', // Returns the updated document.
        runValidators: true // Executes the validations defined in the schema.
    });

    if (!vehicle2) {
        return next(new AppError('Error when updating the vehicle.', 500, 'ERR_VEHICLES_UPDATE_FAILED'));
    }

    // Return vehicle.
    res.status(200).json({
        status: 'success',
        data: {
            _id: vehicle2._id,
            licensePlate: vehicle2.licensePlate,
            type: vehicle2.type,
            brand: vehicle2.brand,
            model: vehicle2.model,
            location: vehicle2.location,
            notes: vehicle2.notes,
            userId: vehicle2.userId,
            dateVehicleCreation: vehicle2.dateVehicleCreation,
            dateLastVehicleModification: vehicle2.dateLastVehicleModification,
            dateLastLocationModification: vehicle2.dateLastLocationModification
        }
    });

});




/*
 * Delete a vehicle by license plate.
 * DELETE /api/vehicles/:licensePlate
 */

exports.deleteVehicle = catchAsync(async (req, res, next) => {

    // Get parameters.
    const licensePlateParam = req.params.licensePlate;
    const userIdParam = req.userId; // The user id is obtained from the token (vía auth-middleware).
    
    // Get vehicle.
    const vehicle = await Vehicle.findOne({ licensePlate: licensePlateParam }).exec();
    if (!vehicle) {
        return next(new AppError('Vehicle not found.', 404, 'ERR_VEHICLES_NOT_FOUND'));
    }

    // Check if the user is authorized to access the vehicle.
    if (vehicle.userId.toString() !== userIdParam) {
        return next(new AppError('The user is not authorized to access this vehicle.', 403, 'ERR_VEHICLES_UNAUTHORIZED_ACCESS'));
    }

    // Delete vehicle from the database.
    const result = await Vehicle.deleteOne({ licensePlate: licensePlateParam }).exec();
    if (result.deletedCount === 0) {
        return next(new AppError('Error when deleting the vehicle.', 500, 'ERR_VEHICLES_DELETE_FAILED'));
    }
    
    // Respond.
    res.status(204).send(); // With no body.

});
