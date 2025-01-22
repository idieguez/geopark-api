const mongoose = require('mongoose');




const logSchema = new mongoose.Schema({

    date: { type: Date, required: true, default: Date.now },
    message: { type: String, required: true }

}, { collection: 'Log' });

const Log = mongoose.model('Log', logSchema);




module.exports = Log;
