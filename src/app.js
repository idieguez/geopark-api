const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require("helmet");
const morgan = require('morgan');

const { router: authRoutes } = require('./routes/auth-routes');
const { router: usersRoutes } = require('./routes/users-routes');
const { router: vehiclesRoutes } = require('./routes/vehicles-routes');
const { AppError } = require('./utils/app-error');
const { errorMiddleware: globalErrorHandler } = require('./middlewares/error-middleware');
const { getFormattedTime } = require('./utils/logger');

const { ENV, CORS_ORIGIN, RL_GENERAL_MIN, RL_GENERAL_NREQ, RL_AUTH_MIN, RL_AUTH_NREQ } = process.env;




// Create the Express application.
const app = express();




// Configure Helmet (strengthen headers security).
app.use(helmet());




// Configure HTTP access logs (Morgan).
morgan.token('time', () => getFormattedTime());

if (ENV === 'DEV') {
    app.use(morgan('[:time] :method :url :status :response-time ms - :res[content-length]'));
} else {
    // app.use(morgan('combined'));
    app.use(morgan('[:time] :remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'));
}




// Configure CORS.
const corsAllowNoOrigin = ENV === 'DEV' || ENV === 'TEST';
const corsWhitelist = CORS_ORIGIN.split(',').map(origin => origin.trim());

const corsOptions = {

    origin: function (origin, callback) {

        // Case A: The origin is explicitly on the whitelist (authorised browsers).
        if (origin && corsWhitelist.indexOf(origin) !== -1) {
            return callback(null, true);
        }

        // Case B: The request has no origin (e.g. Postman). If we are in DEV, we allow it; otherwise, we block it.
        if (!origin && corsAllowNoOrigin) {
            return callback(null, true);
        }

        // Case C: The origin is not permitted or comes without origin (in PRO environment).
        const message = !origin
            ? 'Not allowed by CORS (missing origin).' 
            : `Not allowed by CORS (origin ${origin} not whitelisted).`;
        return callback(new AppError(message, 403, 'ERR_APP_ORIGIN_NOT_ALLOWED_BY_CORS'));

    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
app.use(cors(corsOptions));
app.options(/.* /, cors(corsOptions));




// Configure Rate Limiter.
const generalLimiter = rateLimit({
    windowMs: RL_GENERAL_MIN * 60 * 1000, // X minutes.
    max: RL_GENERAL_NREQ, // Limit to Y requests per IP every X minutes.
    message: { message: `Too many requests from this IP. Please try again after ${RL_GENERAL_MIN} minutes.` },
    standardHeaders: true, // Reports rate limits with standard headers.
    legacyHeaders: false, // Disable obsolete headers.
});

const authLimiter = rateLimit({
    windowMs: RL_AUTH_MIN * 60 * 1000, // X minutes.
    max: RL_AUTH_NREQ, // Limit to Y requests per IP every X minutes.
    message: { message: `Too many authentication attempts from this IP. Please try again after ${RL_AUTH_MIN} minutes.` },
    standardHeaders: true, // Reports rate limits with standard headers.
    legacyHeaders: false, // Disable obsolete headers.
});




// Configure Parsing JSON.
app.use(express.json());




// Configure routes.
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', generalLimiter, usersRoutes);
app.use('/api/vehicles', generalLimiter, vehiclesRoutes);

app.all(/.* /, (req, res, next) => { // Unhandled routes (404).
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404, 'ERR_APP_URL_NOT_FOUND')); // Passing an argument to next() automatically skips to the error handling middleware.
});




// Global error handler.
app.use(globalErrorHandler);




module.exports = { app };
