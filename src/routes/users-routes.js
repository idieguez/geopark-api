const express = require('express');
const { authMiddleware } = require('../middlewares/auth-middleware');
const { getUser, updateUser, deleteUser } = require('../controllers/users-controller');
const { validateUpdateUser } = require('../middlewares/validations/users-validation-middleware');




/*
 * Router creation.
 */

const router = express.Router();




/*
 * Routes for users operations.
 */

router.get('/', authMiddleware, getUser);
router.patch('/', authMiddleware, validateUpdateUser, updateUser);
router.delete('/', authMiddleware, deleteUser);




/*
 * Export of routers.
 */

module.exports = { router };
