const mongoose = require('mongoose');




/*
 * Log schema.
 */

exports.Log = mongoose.model('Log', new mongoose.Schema({

    date: { type: Date, required: true, default: Date.now },
    message: { type: String, required: true }

}, { collection: 'Log' }));
