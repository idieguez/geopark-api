require('dotenv').config({ path: '.env.development' });
const express = require('express');
const { connectToDatabase, disconnectFromDatabase } = require('./database');
const app = require('./app');

// Environment variables for MongoDB connection.
const { APP_PORT } = process.env;




// Connection to the database.
connectToDatabase();




// Start app.
const server = app.listen(APP_PORT, () => {

    console.log({ message: `Server is running on port ${APP_PORT}.` });

});




// Disconnection from the database.
const shutdown = () => {

    console.log({ message: `Shutting down the server...` });
    server.close(async () => {
        await disconnectFromDatabase();
        console.log({ message: `Connections closed. Shutdown completed.` });
        process.exit(0);
    });

};

process.on('SIGINT', shutdown);             // For interruptions (Ctrl+C).
process.on('SIGTERM', shutdown);            // For termination signals.
