// Middleware para registrar las solicitudes entrantes
const requestLogger = (req, res, next) => {
    console.log({ message: `[${new Date().toISOString()}] ${req.method} ${req.url}` });
    next(); // Pasa al siguiente middleware o controlador
};

module.exports = requestLogger;
