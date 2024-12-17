const User = require('../models/User');




exports.getUser = (req, res) => {
    res.send({ message: 'User details retrieved successfully' });
};




exports.getAllUsers = (req, res) => {
    res.send({ message: 'All users retrieved successfully' });
};
