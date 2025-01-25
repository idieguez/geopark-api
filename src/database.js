require('dotenv').config({ path: '.env.development' });
const mongoose = require('mongoose');

// Environment variables for MongoDB connection.
const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_HOST, MONGODB_PORT, MONGODB_DATABASE, MONGODB_AUTH_SOURCE } = process.env;

// URI recommended for development environments (local instance, for example).
const uri = `mongodb://${MONGODB_USER}:${encodeURIComponent(MONGODB_PASSWORD)}@${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DATABASE}?authSource=${MONGODB_AUTH_SOURCE}`;

// URI recommended for production environments (MongoDB Atlas, for example).
// const uri = `mongodb+srv://${MONGODB_USER}:${encodeURIComponent(MONGODB_PASSWORD)}@${MONGODB_HOST}/${MONGODB_DATABASE}?retryWrites=true&w=majority`;




const connectToDatabase = async () => {

    /*
    try {

        await mongoose.connect(uri);
        console.log({ message: `Connected to MongoDB.` });

    } catch (error) {

        console.error({ message: `Error connecting to MongoDB: ${error.message}` });
        process.exit(1);

    }
    */

    mongoose.connect(uri)
        .then(() => console.log({ message: `Database connected successfully.` }))
        .catch(err => console.error({ message: `Database connection error: `, err }));

};




const disconnectFromDatabase = async () => {

    /*
    try {

        await mongoose.disconnect();
        console.log({ message: `Disconnected from MongoDB.` });

    } catch (error) {

        console.error({ message: `Error disconnecting from MongoDB: ${error.message}` });
        process.exit(1);

    }
    */

    mongoose.disconnect()
        .then(() => console.log({ message: `Database disconnected successfully.` }))
        .catch(err => console.error({ message: `Database disconnection error: `, err }));

};




module.exports = { connectToDatabase, disconnectFromDatabase };
