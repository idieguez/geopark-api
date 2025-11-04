const { z } = require('zod');




/*
 * Middleware to validate input data.
 */

exports.validateSchema = function (schema) {
    return async function (req, res, next) {

        try {

            const parsed = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });

            if (parsed && typeof parsed === 'object') {
                if (parsed.body) req.body = parsed.body;
                if (parsed.query) req.query = parsed.query;
                if (parsed.params) req.params = parsed.params;
            }

            return next();

        } catch (err) {

            const formattedError = err.issues.map(issue => {
                const field = issue.path.length > 0 ? issue.path.slice(-1)[0] : 'general';
                return {
                    field: field,
                    message: issue.message
                };
            });

            console.error({ message: `Incorrect data validation.`, details: formattedError });
            return res.status(400).json({
                message: `Incorrect data validation.`,
                details: formattedError
            });

        }

    };

};
