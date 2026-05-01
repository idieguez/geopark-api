require('dotenv').config({ path: '.env' });

require('./utils/logger');
const { connectToDatabase, disconnectFromDatabase } = require('./database');
const { app } = require('./app');

const { APP_PORT: APP_PORT_ENV } = process.env;




// Connection to the database.
connectToDatabase();




// Start app.
const APP_PORT = process.env.PORT || APP_PORT_ENV || 3000; // Ready for deployment in PaaS services.

const server = app.listen(APP_PORT, function () {
    console.log({ message: `Server is running on port ${APP_PORT}.` });
});




// Disconnection from the database.
const shutdown = function () {

    console.log({ message: `Shutting down the server...` });
    server.close(async function () {
        await disconnectFromDatabase();
        console.log({ message: `Connections closed. Shutdown completed.` });
        process.exit(0);
    });

};




// Shutdown signals.
process.on('SIGINT', shutdown); // For interruptions (Ctrl+C).
process.on('SIGTERM', shutdown); // For termination signals.
