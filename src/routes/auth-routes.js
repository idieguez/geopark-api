const express = require('express');
const { register, login } = require('../controllers/auth-controller');




/*
 * Router creation.
 */

exports.router = express.Router();
const router = exports.router;




/*
 * Routes for auth.
 */

router.post('/register/', register);
router.post('/login/', login);
