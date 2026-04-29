/*
 * Custom error class.
 * Extends the built-in Error class to handle operational errors within the application.
 */

exports.AppError = class AppError extends Error {

    constructor(message, statusCode, errorCode = 'ERR_INTERNAL_SERVER') {

        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.errorCode = errorCode;
        this.isOperational = true; // Flags errors we anticipated (not programming bugs).

        Error.captureStackTrace(this, this.constructor);

    }

}
