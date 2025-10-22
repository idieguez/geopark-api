/*
 * Middleware that registers in console the received request.
 */

exports.loggerMiddleware = function(req, res, next) {

    console.log({ message: `${req.method} ${req.url}` });
    next();                                                                                         // Call the next middleware.

};
