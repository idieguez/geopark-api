// Middleware para manejar errores
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
      error: err.message || `Error interno del servidor`,
    });
};

// Middleware para manejar rutas no encontradas
const notFoundHandler = (req, res, next) => {
    res.status(404).json({ error: `Ruta no encontrada` });
};

module.exports = {
    errorHandler,
    notFoundHandler
};
