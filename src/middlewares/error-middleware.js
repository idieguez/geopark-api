const { AppError } = require('../utils/app-error');




/*
 * Helper functions to transform Mongoose/JWT errors into AppError.
 */

// Invalid ID error (e.g., searching for an ID that is not in MongoDB format).
const handleCastErrorDB = err => {

    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400, 'ERR_DB_CAST_ERROR');

};

// Duplicate fields error (MongoDB code 11000).
const handleDuplicateFieldsDB = err => {

    const value = err.errmsg ? err.errmsg.match(/(["'])(\\?.)*?\1/)[0] : 'Duplicate value'; // Extract the value that caused the error (e.g. the email address).

    const message = `Duplicate field value: ${value}. Please use another value.`;
    return new AppError(message, 409, 'ERR_DB_DUPLICATE_FIELD');

};

// Mongoose validation error (e.g., a required field is missing).
const handleValidationErrorDB = err => {

    const errors = Object.values(err.errors).map(el => el.message); // Combine all error messages into one.
    
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400, 'ERR_DB_VALIDATION_ERROR');

};

// JWT errors (invalid or expired token).
const handleJWTError = () => 
    new AppError('Invalid token. Please log in again.', 401, 'ERR_AUTH_TOKEN_INVALID');

const handleJWTExpiredError = () => 
    new AppError('Your token has expired. Please log in again.', 401, 'ERR_AUTH_TOKEN_EXPIRED');

// JSON syntax error (e.g., express.json() failing to parse invalid JSON).
const handleJSONSyntaxError = () => 
    new AppError('Invalid JSON format in the request body.', 400, 'ERR_APP_INVALID_JSON_PAYLOAD');




/*
 * Global error handling middleware.
 * Centralizes error response formatting and logging.
 */

exports.errorMiddleware = function(err, req, res, next) {

    // Early assignment of status code (so that err has a default value).
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';


    // Preparation and translation of error messages.
    let error = { ...err };
    error.message = err.message;
    error.name = err.name;
    error.errorCode = err.errorCode || 'ERR_INTERNAL_SERVER';
    if (err.code) error.code = err.code;

    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) error = handleJSONSyntaxError(); // JSON Syntax error.
    if (error.name === 'CastError') error = handleCastErrorDB(error); // Invalid ID error.
    if (error.code === 11000) error = handleDuplicateFieldsDB(err); // Duplicate fields error. We pass the original "err" which usually has errmsg.
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error); // Mongoose validation error.
    if (error.name === 'JsonWebTokenError') error = handleJWTError(); // JWT error.
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError(); // JWT error.
    

    // We ensure that the status code is correct.
    // If the error is an AppError, it will have its own statusCode. If not, we use the one from err.
    const statusCode = error.statusCode || err.statusCode;


    // Development: send detailed error information.
    if (process.env.ENV === 'DEV') {
        
        // Log error.
        console.error({ message: `Error: ${err.message}`, details: err});

        // Send detailed error information.
        res.status(statusCode).json({
            status: error.status, // We use the translated error status.
            errorCode: error.errorCode, // We use the error code.
            error: err, // We retain the original raw object for inspection.
            message: error.message, // We use the personalised message.
            stack: err.stack // We keep the original stack trace.
        });


    // Production (or another not defined environment): send generic message for security.
    } else {

        // Operational error: send semi-detailed error information.
        if (error.isOperational) {

            res.status(statusCode).json({
                status: error.status,
                errorCode: error.errorCode,
                message: error.message
            });

        // Programming or other unknown error: don't leak error details.
        } else {

            // Log error.
            console.error({ message: `Error: ${err.message}`, details: err});

            // Send generic error message.
            res.status(500).json({
                status: 'error',
                errorCode: 'ERR_INTERNAL_SERVER',
                message: 'Something went wrong!'
            });
        }

    }

};
