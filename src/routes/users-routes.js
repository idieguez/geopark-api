const express = require('express');
const { authMiddleware } = require('../middlewares/auth-middleware');
const { getUser, updateUser, deleteUser } = require('../controllers/users-controller');




/*
 * Router creation.
 */

exports.router = express.Router();
const router = exports.router;




/*
 * Routes for users operations.
 */

router.get('/', authMiddleware, getUser);
router.patch('/', authMiddleware, updateUser);
router.delete('/', authMiddleware, deleteUser);
