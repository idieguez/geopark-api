const express = require('express');
const { authMiddleware } = require('../middlewares/auth-middleware');
const { getUser, updateUser, deleteUser } = require('../controllers/users-controller');
const { validateUpdateUser } = require('../middlewares/validations/users-validation-middleware');




/*
 * Router creation.
 */

exports.router = express.Router();
const router = exports.router;




/*
 * Routes for users operations.
 */

router.get('/', authMiddleware, getUser);
router.patch('/', authMiddleware, validateUpdateUser, updateUser);
router.delete('/', authMiddleware, deleteUser);
