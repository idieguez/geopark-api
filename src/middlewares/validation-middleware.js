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

            // "First error wins" approach. We extract only the first validation issue.
            const firstIssue = err.issues[0];
            const rawMessage = firstIssue.message;
            
            let errorCode = 'ERR_APP_INVALID_INPUT_DATA'; // Fallback code.
            let cleanMessage = rawMessage;

            // Check if our custom message contains the "|" separator.
            if (rawMessage.includes('|')) {
                const parts = rawMessage.split('|');
                errorCode = parts[0];
                cleanMessage = parts[1];

            // For native Zod errors (e.g. strict mode "Unrecognized key").
            } else {
                const field = firstIssue.path.length > 0 ? firstIssue.path.slice(-1)[0] : 'general';
                cleanMessage = `Invalid input data. ${field}: ${cleanMessage}`;
            }

            // We pass the error to the global handler. We use 400 Bad Request.
            return next(new AppError(cleanMessage, 400, errorCode));

        }

    };

};
