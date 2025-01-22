const Vehicle = require('../models/Vehicle');




exports.createVehicle = async (req, res) => {

    try {

        // Get parameters.
        const {
            licensePlate: licensePlateParam,
            type: typeParam,
            brand: brandParam,
            model: modelParam,
            notes: notesParam,
            userId: userIdParam
        } = req.body;

        // Check if the license plate already exists.
        const existingVehicle = await Vehicle.findOne({ licensePlate: licensePlateParam }).exec();
        if (existingVehicle) {
            return res.status(409).json({ message: `The license plate already exists.` });
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
            dateLastLocationModification: new Date()
        });

        // Save vehicle in the database.
        await vehicle.save();

        // Return vehicle.
        res.status(201).json({
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
        });

    } catch (error) {

        // Log error.
        console.error({ message: `Error when creating the vehicle: ${error}` });
        res.status(500).json({ message: `Error when creating the vehicle.` });

    }

};




exports.getVehiclesByUserId = async (req, res) => {

    try {

        // Get parameters.
        const userIdParam = req.query.userId;
        if (!userIdParam) {
            return res.status(400).json({ message: `The user id is required.` });
        }

        // Get vehicles.
        const vehicles = await Vehicle.find({ userId: userIdParam }).exec();
        if (vehicles.length === 0) {
            return res.status(404).json({ message: `No vehicles found for this user.` });
        }

        // Return vehicles.
        res.status(200).json(vehicles.map(vehicle => ({
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
        })));

    } catch (error) {

        // Log error.
        console.error({ message: `Error when searching for the user's vehicles: ${error}` });
        res.status(500).json({ message: `Error when searching for the user's vehicles.` });

    }

};




exports.getVehicleByLicensePlate = async (req, res) => {

    try {

        // Get parameters.
        const licensePlateParam = req.params.licensePlate;
        if (!licensePlateParam) {
            return res.status(400).json({ message: `The license plate is required.` });
        }

        // Get vehicle.
        const vehicle = await Vehicle.findOne({ licensePlate: licensePlateParam }).exec();
        if (!vehicle) {
            return res.status(404).json({ message: `Vehicle not found.` });
        }

        // Return vehicle.
        res.status(200).json({
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
        });

    } catch (error) {

        // Log error.
        console.error({ message: `Error when searching for the vehicle: ${error}` });
        res.status(500).json({ message: `Error when searching for the vehicle.` });

    }

};




exports.updateVehicle = async (req, res) => {

    try {

        // Get parameters.
        const licensePlateParam = req.params.licensePlate;
        if (!licensePlateParam) {
            return res.status(400).json({ message: `The license plate is required.` });
        }

        const vehicleParam = req.body;

        // Exclude _id, licensePlate, userId and dates from updates.
        if (vehicleParam._id) {
            return res.status(400).json({ message: `It is not allowed to update the vehicle id.` });
        }

        if (vehicleParam.licensePlate) {
            return res.status(400).json({ message: `It is not allowed to update the vehicle's license plate.` });
        }

        if (vehicleParam.userId) {
            return res.status(400).json({ message: `It is not allowed to update the user id associated with the vehicle.` });
        }
        
        if (vehicleParam.dateVehicleCreation || vehicleParam.dateLastVehicleModification || vehicleParam.dateLastLocationModification) {
            return res.status(400).json({ message: `It is not allowed to update the dates.` });
        }

        // Check if the location is being updated.
        if (vehicleParam.location) {

            if (!vehicleParam.location.latitude  || vehicleParam.location.latitude  === null || vehicleParam.location.latitude  === '' ||
                !vehicleParam.location.longitude || vehicleParam.location.longitude === null || vehicleParam.location.longitude === '') {
                
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
            return res.status(404).json({ message: `Vehicle not found.` });
        }

        // Update vehicle in the database.
        const vehicleId = vehicle1._id;
        const vehicle2 = await Vehicle.findByIdAndUpdate(vehicleId, vehicleParam, {
            new: true,                  // Returns the updated document.
            runValidators: true         // Executes the validations defined in the schema.
        });

        if (!vehicle2) {
            return res.status(404).json({ message: `Vehicle not found.` });
        }

        // Return vehicle.
        res.status(200).json({
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
        });

    } catch (error) {

        // Log error.
        console.error({ message: `Error when updating the vehicle: ${error}` });
        res.status(500).json({ message: `Error when updating the vehicle.` });

    }

};
