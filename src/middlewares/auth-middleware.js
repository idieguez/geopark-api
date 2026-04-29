const jwt = require('jsonwebtoken');

const { User } = require('../models/User');
const { AppError } = require('../utils/app-error');
const { catchAsync } = require('../utils/catch-async');

const { JWT_SECRET } = process.env;




/*
 * Middleware to verify authentication.
 */

exports.authMiddleware = catchAsync(async (req, res, next) => {

    // Get token from the header.
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('A valid token was not found. Authorization denied.', 401, 'ERR_AUTH_TOKEN_NOT_FOUND'));
    }

    // Verify the token.
    const decoded = jwt.verify(token, JWT_SECRET); // If it fails (expired or invalid), it throws an error that catchAsync catches.

    // Verify the user id exists.
    const user = await User.findOne({ _id: decoded.userId }).exec();
    if (!user) {
        return next(new AppError('Invalid or expired token. Authorization denied.', 401, 'ERR_AUTH_TOKEN_INVALID_OR_EXPIRED'));
    }

    // Verify if the token was issued before a password change.
    if (user.dateLastPasswordModification) {
        const changedTimestamp = parseInt(user.dateLastPasswordModification.getTime() / 1000, 10);
        
        if (changedTimestamp > decoded.iat) {
            return next(new AppError('Token is no longer valid due to a password change. Please log in again.', 401, 'ERR_AUTH_TOKEN_EXPIRED_PASSWORD_CHANGED'));
        }
    }

    // Add the user id to the request object.
    req.userId = decoded.userId;
    
    // Call the next middleware.
    next();

});
