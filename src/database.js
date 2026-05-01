const mongoose = require('mongoose');

const { MONGODB_URI, MONGODB_USER, MONGODB_PASSWORD, MONGODB_HOST, MONGODB_PORT, MONGODB_DATABASE, MONGODB_AUTH_SOURCE } = process.env;




/*
 * Generates the connection URI based on the available environment variables. Prioritizes MONGODB_URI for cloud environments.
 */

const getMongoUri = () => {

    // If a full URI is provided (standard in PaaS), use it directly.
    if (MONGODB_URI) {
        return MONGODB_URI;
    }

    // Default to the standard connection string for local development.
    return `mongodb://${MONGODB_USER}:${encodeURIComponent(MONGODB_PASSWORD)}@${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DATABASE}?authSource=${MONGODB_AUTH_SOURCE}`;

};

const uri = getMongoUri();




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
