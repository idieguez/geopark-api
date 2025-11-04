const express = require('express');
const { register, login } = require('../controllers/auth-controller');
const { validateRegister, validateLogin } = require('../middlewares/validations/auth-validation-middleware');




/*
 * Router creation.
 */

exports.router = express.Router();
const router = exports.router;




/*
 * Routes for auth operations.
 */

router.post('/register/', validateRegister, register);
router.post('/login/', validateLogin, login);
