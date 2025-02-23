const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const usersController = require('../controllers/users-controller');




/*
 * Routes for users operations.
 */

router.get('/', authMiddleware, usersController.getUser);
router.patch('/', authMiddleware, usersController.updateUser);
router.delete('/', authMiddleware, usersController.deleteUser);




module.exports = router;
