const express = require('express');
const { register, login } = require('../controllers/auth-controller');
const { validateRegister } = require('../middlewares/auth-validation-middleware');




/*
 * Router creation.
 */

exports.router = express.Router();
const router = exports.router;




/*
 * Routes for auth.
 */

router.post('/register/', validateRegister, register);
router.post('/login/', login);
