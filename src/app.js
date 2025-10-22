const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { loggerMiddleware } = require('./middlewares/logger-middleware');
const { router: authRoutes } = require('./routes/auth-routes');
const { router: usersRoutes } = require('./routes/users-routes');
const { router: vehiclesRoutes } = require('./routes/vehicles-routes');




// Create the Express application.
exports.app = express();
const app = exports.app;




// Configure CORS.
const corsOptions = {
    origin: 'http://127.0.0.1:3000',
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




// Middleware for logging.
app.use(loggerMiddleware);




// Disable the X-Powered-By header.
app.disable('x-powered-by');




// Middleware for parsing JSON.
app.use(express.json());




// Routes.
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/vehicles', vehiclesRoutes);
