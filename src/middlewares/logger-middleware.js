/*
 * Middleware that registers in console the received request.
 */

module.exports = function(req, res, next) {

    console.log({ message: `${req.method} ${req.url}` });
    next();                                                                                         // Call the next middleware.

};
