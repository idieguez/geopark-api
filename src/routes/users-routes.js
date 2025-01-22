const express = require('express');
const { createUser, getUserByEmail, updateUser } = require('../controllers/users-controller');
const router = express.Router();




router.post('', createUser);
router.get('/:email', getUserByEmail);
router.patch('/:email', updateUser);




module.exports = router;
