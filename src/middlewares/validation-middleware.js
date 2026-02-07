const { AppError } = require('../utils/app-error');




/*
 * Middleware to validate input data.
 */

exports.validateSchema = function (schema) {
    return async function (req, res, next) {

        try {

            // We parse the data (body, query, params) against the Zod schema.
            const parsed = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params
            });

            // If there is data transformation (e.g. string to number), we update the request.
            if (parsed && typeof parsed === 'object') {
                if (parsed.body) req.body = parsed.body;
                if (parsed.query) req.query = parsed.query;
                if (parsed.params) req.params = parsed.params;
            }

            return next(); // Call the next middleware.

        } catch (err) {

            // We format Zod's errors to make them readable. Zod returns an 'issues' array. We convert them to a single string.
            const errorMessages = err.issues.map(issue => {
                const field = issue.path.length > 0 ? issue.path.slice(-1)[0] : 'general';
                return `${field}: ${issue.message}`;
            }).join('. ');

            const message = `Invalid input data. ${errorMessages}`;

            // We pass the error to the global handler. We use 400 Bad Request.
            return next(new AppError(message, 400));

        }

    };

};
