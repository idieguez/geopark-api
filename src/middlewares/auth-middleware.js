const { User } = require('../models/User');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;




/*
 * Middleware to verify authentication.
 */

exports.authMiddleware = async function(req, res, next) {

    try {

        // Get token from the header.
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: `A valid token was not found. Authorization denied.` });
        }

        // Verify the token.
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: `Invalid or expired token. Authorization denied.` });
        }

        if (!decoded.userId || decoded.userId === '') {
            return res.status(401).json({ message: `The user id is not included in the token. Authorization denied.` });
        }

        // Verify the user id exists.
        const user = await User.findOne({ _id: decoded.userId }).exec();
        if (!user) {
            return res.status(401).json({ message: `Invalid or expired token. Authorization denied.` });
        }

        // Add the user id to the request object.
        req.userId = decoded.userId;
        
        // Continue with the following function in the middleware chain.
        next();

    } catch (err) {

        console.error({ message: `Invalid or expired token. Authorization denied. Error: ${err}` });
        res.status(401).json({ message: `Invalid or expired token. Authorization denied.` });

    }

};
