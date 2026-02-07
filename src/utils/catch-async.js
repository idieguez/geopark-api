/*
 * Async error wrapper.
 * Wraps async middleware / controller functions to avoid repetitive try-catch blocks.
 */

exports.catchAsync = fn => {

    return (req, res, next) => {
        fn(req, res, next).catch(next); // Passes any error to the global error handler.
    };

};
