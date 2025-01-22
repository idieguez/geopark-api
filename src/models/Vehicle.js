const mongoose = require('mongoose');




const vehicleSchema = new mongoose.Schema({

    licensePlate: { type: String, required: true, unique: true },
    type: { type: String, enum: ['car', 'motorbike'], required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    location: {
        latitude: { type: Number, default: null },
        longitude: { type: Number, default: null }
    },
    notes: { type: String, default: '' },
    // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userId: { type: String, required: true },
    dateVehicleCreation: { type: Date, required: true, default: Date.now },
    dateLastVehicleModification: { type: Date, required: true, default: Date.now },
    dateLastLocationModification: { type: Date, required: true, default: Date.now }

}, { collection: 'Vehicle' });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);




module.exports = Vehicle;
