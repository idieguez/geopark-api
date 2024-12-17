const express = require('express');
const { getUser, getAllUsers } = require('../controllers/users-controller');
const router = express.Router();




router.get('/getUser', getUser);
router.get('/getAllUsers', getAllUsers);




module.exports = router;
