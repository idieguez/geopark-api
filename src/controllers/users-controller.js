const User = require('../models/User');
const bcrypt = require('bcrypt');




/*
 * Get a user.
 * GET /api/users/
 */

exports.getUser = async (req, res) => {

    try {

        // Get parameters.
        const userIdParam = req.userId;             // The user id is obtained from the token (vía auth-middleware).

        // Get user.
        const user = await User.findOne({ _id: userIdParam }).exec();
        if (!user) {
            return res.status(404).json({ message: `User not found.` });
        }

        // Return user.
        res.status(200).json({
            _id: user._id,
            name: user.name,
            surname: user.surname,
            secondSurname: user.secondSurname,
            email: user.email,
            newsletter: user.newsletter,
            settings: user.settings,
            notes: user.notes,
            dateUserCreation: user.dateUserCreation,
            dateLastUserModification: user.dateLastUserModification,
            dateLastPasswordModification: user.dateLastPasswordModification
        });

    } catch (error) {

        // Log error.
        console.error({ message: `Error when searching for the user: ${error}` });
        res.status(500).json({ message: `Error when searching for the user.` });

    }

};




/*
 * Update a user.
 * PATCH /api/users/
 */

exports.updateUser = async (req, res) => {

    try {

        // Get parameters.
        const userIdParam = req.userId;             // The user id is obtained from the token (vía auth-middleware).
        const userParam = req.body;

        // Exclude _id, email and dates from updates.
        if (userParam._id) {
            return res.status(400).json({ message: `It is not allowed to update the user id.` });
        }

        if (userParam.email) {
            return res.status(400).json({ message: `It is not allowed to update the user's email address.` });
        }
        
        if (userParam.dateUserCreation || userParam.dateLastUserModification || userParam.dateLastPasswordModification) {
            return res.status(400).json({ message: `It is not allowed to update the dates.` });
        }

        // Check if the password is being updated.
        if (userParam.password) {
            userParam.password = await bcrypt.hash(userParam.password, 12);
            userParam.dateLastPasswordModification = new Date();
        }

        // Dates update.
        userParam.dateLastUserModification = new Date();

        // Get user.
        const user1 = await User.findOne({ _id: userIdParam }).exec();
        if (!user1) {
            return res.status(404).json({ message: `User not found.` });
        }

        // Update user in the database.
        const user2 = await User.findByIdAndUpdate(userIdParam, userParam, {
            new: true,                  // Returns the updated document.
            runValidators: true         // Executes the validations defined in the schema.
        });

        if (!user2) {
            return res.status(404).json({ message: `Error when updating the user.` });
        }

        // Return user.
        res.status(200).json({
            _id: user2._id,
            name: user2.name,
            surname: user2.surname,
            secondSurname: user2.secondSurname,
            email: user2.email,
            newsletter: user2.newsletter,
            settings: user2.settings,
            notes: user2.notes,
            dateUserCreation: user2.dateUserCreation,
            dateLastUserModification: user2.dateLastUserModification,
            dateLastPasswordModification: user2.dateLastPasswordModification
        });

    } catch (error) {

        // Log error.
        console.error({ message: `Error when updating the user: ${error}` });
        res.status(500).json({ message: `Error when updating the user.` });

    }

};




/*
 * Delete a user.
 * DELETE /api/users/
 */

exports.deleteUser = async (req, res) => {

    try {

        // Get parameters.
        const userIdParam = req.userId;             // The user id is obtained from the token (vía auth-middleware).

        // Get user.
        const user = await User.findOne({ _id: userIdParam }).exec();
        if (!user) {
            return res.status(404).json({ message: `User not found.` });
        }

        // Delete user from the database.
        const result = await User.deleteOne({ _id: userIdParam }).exec();
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: `Error when deleting the user.` });
        }
        
        // Respond.
        res.status(200).json({ message: `User deleted successfully.` });

    } catch (error) {

        // Log error.
        console.error({ message: `Error when searching for the user: ${error}` });
        res.status(500).json({ message: `Error when searching for the user.` });

    }

};
