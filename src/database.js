const mongoose = require('mongoose');
const uri = 'mongodb://admin:admin@localhost:27017/geopark?authSource=admin';




const connectToDatabase = async () => {

    try {

        await mongoose.connect(uri);
        console.log({ message: `Connected to MongoDB.` });

    } catch (error) {

        console.error({ message: `Error connecting to MongoDB: ${error.message}` });
        process.exit(1);

    }

};




const disconnectFromDatabase = async () => {

    try {

        await mongoose.disconnect();
        console.log({ message: `Disconnected from MongoDB.` });

    } catch (error) {

        console.error({ message: `Error disconnecting from MongoDB: ${error.message}` });
        process.exit(1);

    }

};




module.exports = { connectToDatabase, disconnectFromDatabase };
