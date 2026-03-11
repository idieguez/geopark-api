const bcrypt = require('bcrypt');

const { User } = require('../models/User');
const { AppError } = require('../utils/app-error');
const { catchAsync } = require('../utils/catch-async');




/*
 * Get a user.
 * GET /api/users/
 */

exports.getUser = catchAsync(async (req, res, next) => {

    // Get parameters.
    const userIdParam = req.userId; // The user id is obtained from the token (vía auth-middleware).

    // Get user.
    const user = await User.findOne({ _id: userIdParam }).exec();
    if (!user) {
        return next(new AppError(`User not found.`, 404));
    }

    // Return user.
    res.status(200).json({
        status: 'success',
        data: {
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
        }
    });

});




/*
 * Update a user.
 * PATCH /api/users/
 */

exports.updateUser = catchAsync(async (req, res, next) => {

    // Get parameters.
    const userIdParam = req.userId; // The user id is obtained from the token (vía auth-middleware).
    const userParam = req.body;

    // Exclude _id, email and dates from updates.
    if (userParam._id) {
        return next(new AppError(`It is not allowed to update the user id.`, 400));
    }

    if (userParam.email) {
        return next(new AppError(`It is not allowed to update the user's email address.`, 400));
    }
    
    if (userParam.dateUserCreation || userParam.dateLastUserModification || userParam.dateLastPasswordModification) {
        return next(new AppError(`It is not allowed to update the dates.`, 400));
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
        return next(new AppError(`User not found.`, 404));
    }

    // Update user in the database.
    const user2 = await User.findByIdAndUpdate(userIdParam, userParam, {
        new: true, // Returns the updated document.
        runValidators: true // Executes the validations defined in the schema.
    });

    if (!user2) {
        return next(new AppError(`Error when updating the user.`, 404));
    }

    // Return user.
    res.status(200).json({
        status: 'success',
        data: {
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
        }
    });

});




/*
 * Delete a user.
 * DELETE /api/users/
 */

exports.deleteUser = catchAsync(async (req, res, next) => {

    // Get parameters.
    const userIdParam = req.userId; // The user id is obtained from the token (vía auth-middleware).

    // Get user.
    const user = await User.findOne({ _id: userIdParam }).exec();
    if (!user) {
        return next(new AppError(`User not found.`, 404));
    }

    // Delete user from the database.
    const result = await User.deleteOne({ _id: userIdParam }).exec();
    if (result.deletedCount === 0) {
        return next(new AppError(`Error when deleting the user.`, 404));
    }
    
    // Respond.
    res.status(204).send(); // With no body.

});
