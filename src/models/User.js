const mongoose = require('mongoose');




/*
 * User schema.
 */

exports.User = mongoose.model('User', new mongoose.Schema({

    name: { type: String, required: true },
    surname: { type: String, required: true },
    secondSurname: { type: String, default: null },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Encrypted password
    newsletter: { type: Boolean, required: true, default: false },
    settings: {
        appearance: { type: String, enum: ['auto', 'light', 'dark'], required: true, default: 'auto' }
    },
    notes: { type: String, default: null },
    loginAttempts: { type: Number, required: true, default: 0 },
    lockUntil: { type: Date, default: null },
    dateUserCreation: { type: Date, required: true, default: Date.now },
    dateLastUserModification: { type: Date, required: true, default: Date.now },
    dateLastPasswordModification: { type: Date, required: true, default: Date.now }

}, { collection: 'User' }));
