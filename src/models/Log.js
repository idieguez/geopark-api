const mongoose = require('mongoose');




/*
 * Log schema.
 */

const logSchema = new mongoose.Schema({

    date: { type: Date, required: true, default: Date.now },
    message: { type: String, required: true }

}, { collection: 'Log' });

exports.Log = mongoose.model('Log', logSchema);
