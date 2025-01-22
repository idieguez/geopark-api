const express = require('express');
const { connectToDatabase, disconnectFromDatabase } = require('./database');
const app = require('./app');
const PORT = process.env.PORT || 3000;




// Connection to the database.
connectToDatabase();




// Start app.
const server = app.listen(PORT, () => {

    console.log( `Server is running on port ${PORT}.` );

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
