const express = require('express');
const usersRoutes = require('./routes/users-routes');
const vehiclesRoutes = require('./routes/vehicles-routes');

const app = express();

app.disable('x-powered-by');        // Disable the header.
app.use(express.json());            // Middleware for parsing JSON.




// Routes.
app.use('/api/users', usersRoutes);
app.use('/api/vehicles', vehiclesRoutes);




module.exports = app;
