const express = require('express');
const { register, login } = require('../controllers/auth-controller');
const { validateRegister, validateLogin } = require('../middlewares/validations/auth-validation-middleware');




/*
 * Router creation.
 */

const router = express.Router();




/*
 * Routes for auth operations.
 */

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);




/*
 * Export of routers.
 */

module.exports = { router };
