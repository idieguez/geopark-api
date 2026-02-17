const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongo = null;




/*
 * Connect to the in-memory database.
 */

exports.connect = async () => {

    mongo = await MongoMemoryServer.create(); // Create the in-memory server instance.
    const uri = mongo.getUri(); // Get the connection URI.
    await mongoose.connect(uri); // Connect Mongoose to this URI.

};




/*
 * Drop database, close the connection and stop mongod.
 */

exports.closeDatabase = async () => {

    if (mongo) {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongo.stop();
    }

};




/*
 * Remove all the data for all db collections.
 */

exports.clearDatabase = async () => {

    if (mongo) {
        const collections = mongoose.connection.collections;

        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany();
        }
    }

};
