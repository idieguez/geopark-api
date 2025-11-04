const mongoose = require('mongoose');




/*
 * Vehicle schema.
 */

exports.Vehicle = mongoose.model('Vehicle', new mongoose.Schema({

    licensePlate: { type: String, required: true },
    type: { type: String, enum: ['car', 'motorbike'], required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    location: {
        latitude: { type: Number, default: null },
        longitude: { type: Number, default: null }
    },
    notes: { type: String, default: '' },
    userId: { type: String, required: true },
    dateVehicleCreation: { type: Date, required: true, default: Date.now },
    dateLastVehicleModification: { type: Date, required: true, default: Date.now },
    dateLastLocationModification: { type: Date, default: Date.now }

}, { collection: 'Vehicle' }));
