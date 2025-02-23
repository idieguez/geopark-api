const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth-routes');
const usersRoutes = require('./routes/users-routes');
const vehiclesRoutes = require('./routes/vehicles-routes');




// Create the Express application.
const app = express();

// Configure CORS.
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS']
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Configure and use the rate limiter.
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,                                       // 15 minutes.
    max: 100,                                                       // Limit to 100 requests per IP every 15 minutes.
    message: `Too many requests from this IP, try again later.`,
    standardHeaders: true,                                          // Reports rate limits with standard headers.
    legacyHeaders: false,                                           // Disable obsolete headers.
});
app.use(limiter);

// Disable the X-Powered-By header.
app.disable('x-powered-by');

// Middleware for parsing JSON.
app.use(express.json());




// Routes.
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/vehicles', vehiclesRoutes);




module.exports = app;
