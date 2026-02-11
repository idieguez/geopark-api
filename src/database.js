const mongoose = require('mongoose');

// Environment variables for MongoDB connection.
const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_HOST, MONGODB_PORT, MONGODB_DATABASE, MONGODB_AUTH_SOURCE } = process.env;

// URI recommended for development environments (local instance, for example).
const uri = `mongodb://${MONGODB_USER}:${encodeURIComponent(MONGODB_PASSWORD)}@${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DATABASE}?authSource=${MONGODB_AUTH_SOURCE}`;

// URI recommended for production environments (MongoDB Atlas, for example).
// const uri = `mongodb+srv://${MONGODB_USER}:${encodeURIComponent(MONGODB_PASSWORD)}@${MONGODB_HOST}/${MONGODB_DATABASE}?retryWrites=true&w=majority`;




/*
 * Connects to the MongoDB database.
 */

exports.connectToDatabase = async function () {

    mongoose.connect(uri)
        .then(() => console.log({ message: `Database connected successfully.` }))
        .catch(err => console.error({ message: `Database connection error: `, details: err }));

};




/*
 * Disconnects from the MongoDB database.
 */

exports.disconnectFromDatabase = async function () {

    mongoose.disconnect()
        .then(() => console.log({ message: `Database disconnected successfully.` }))
        .catch(err => console.error({ message: `Database disconnection error: `, details: err }));

};
