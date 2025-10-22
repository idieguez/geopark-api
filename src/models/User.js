const mongoose = require('mongoose');




/*
 * User schema.
 */

const userSchema = new mongoose.Schema({

    name: { type: String, required: true },
    surname: { type: String, required: true },
    secondSurname: { type: String, default: '' },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Encrypted password
    newsletter: { type: Boolean, required: true, default: false },
    settings: {
        appearance: { type: String, enum: ['auto', 'light', 'dark'], required: true, default: 'auto' }
    },
    notes: { type: String, default: '' },
    dateUserCreation: { type: Date, required: true, default: Date.now },
    dateLastUserModification: { type: Date, required: true, default: Date.now },
    dateLastPasswordModification: { type: Date, required: true, default: Date.now }

}, { collection: 'User' });

exports.User = mongoose.model('User', userSchema);
