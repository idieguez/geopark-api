const express = require('express');

const { authMiddleware } = require('../middlewares/auth-middleware');
const { getUser, updateUser, updatePassword, deleteAccount } = require('../controllers/users-controller');
const { validateUpdateUser, validateUpdatePassword, validateDeleteAccount } = require('../middlewares/validations/users-validation-middleware');




/*
 * Router creation.
 */

const router = express.Router();




/*
 * Routes for users operations.
 */

router.get('/', authMiddleware, getUser);
router.patch('/', authMiddleware, validateUpdateUser, updateUser);
router.patch('/update-password', authMiddleware, validateUpdatePassword, updatePassword);
router.post('/delete-account/', authMiddleware, validateDeleteAccount, deleteAccount);




/*
 * Export of routers.
 */

module.exports = { router };
