// Middleware para verificar la autenticación
const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    
    if (!token) {
      return res.status(401).json({ error: 'Acceso no autorizado. Token no proporcionado.' });
    }
  
    // Aquí podrías verificar el token usando alguna librería como jwt
    try {
      // Ejemplo: Verificación ficticia del token
      if (token === 'valid-token') {
        next(); // Token válido, continuar
      } else {
        throw new Error('Token inválido');
      }
    } catch (error) {
      return res.status(401).json({ error: 'Acceso no autorizado. Token inválido.' });
    }
};

module.exports = authenticate;
