const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require('../models/User');
const { Vehicle } = require('../models/Vehicle');
const { AppError } = require('../utils/app-error');
const { catchAsync } = require('../utils/catch-async');

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;




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
        return next(new AppError('User not found.', 404, 'ERR_USERS_NOT_FOUND'));
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
        return next(new AppError('It is not allowed to update the user id.', 400, 'ERR_USERS_FORBIDDEN_UPDATE_ID'));
    }

    if (userParam.email) {
        return next(new AppError('It is not allowed to update the user\'s email address.', 400, 'ERR_USERS_FORBIDDEN_UPDATE_EMAIL'));
    }

    if (userParam.dateUserCreation || userParam.dateLastUserModification || userParam.dateLastPasswordModification) {
        return next(new AppError('It is not allowed to update the dates.', 400, 'ERR_USERS_FORBIDDEN_UPDATE_DATES'));
    }

    // Dates update.
    userParam.dateLastUserModification = new Date();

    // Get user.
    const user1 = await User.findOne({ _id: userIdParam }).exec();
    if (!user1) {
        return next(new AppError('User not found.', 404, 'ERR_USERS_NOT_FOUND'));
    }

    // Update user in the database.
    const user2 = await User.findByIdAndUpdate(userIdParam, userParam, {
        returnDocument: 'after', // Returns the updated document.
        runValidators: true // Executes the validations defined in the schema.
    });

    if (!user2) {
        return next(new AppError('Error when updating the user.', 500, 'ERR_USERS_UPDATE_FAILED'));
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
 * Update user password.
 * PATCH /api/users/update-password/
 */

exports.updatePassword = catchAsync(async (req, res, next) => {

    // Get parameters.
    const userIdParam = req.userId; // The user id is obtained from the token (vía auth-middleware).
    const {
        passwordCurrent: passwordCurrentParam,
        passwordNew: passwordNewParam
    } = req.body;

    // Get user. We explicitly select the password because it has select: false in the model.
    const user = await User.findOne({ _id: userIdParam }).select('+password').exec();
    if (!user) {
        return next(new AppError('User not found.', 404, 'ERR_USERS_NOT_FOUND'));
    }

    // Check if current password is correct.
    const isMatch = await bcrypt.compare(passwordCurrentParam, user.password);
    if (!isMatch) {
        return next(new AppError('The current password is incorrect.', 401, 'ERR_USERS_WRONG_PASSWORD'));
    }

    // Hash the new password.
    const hashedPassword = await bcrypt.hash(passwordNewParam, 12);

    // Update user in the database.
    const updatedUser = await User.findByIdAndUpdate(userIdParam, {
        password: hashedPassword,
        dateLastPasswordModification: new Date(),
        dateLastUserModification: new Date()
    }, { 
        returnDocument: 'after', // Using the updated mongoose standard
        runValidators: true 
    });

    if (!updatedUser) {
        return next(new AppError('Error when updating the password.', 500, 'ERR_USERS_PASSWORD_UPDATE_FAILED'));
    }

    // Generate a new JWT token to keep the user logged in seamlessly.
    const token = jwt.sign(
        { userId: updatedUser._id },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );

    // Return response.
    res.status(200).json({
        status: 'success',
        data: {
            token: token
        }
    });

});




/*
 * Delete user account.
 * POST /api/users/delete-account/
 */

exports.deleteAccount = catchAsync(async (req, res, next) => {

    // Get parameters.
    const userIdParam = req.userId; // The user id is obtained from the token (vía auth-middleware).
    const { password: passwordParam } = req.body;

    // Get user. We explicitly select the password because it has select: false in the model.
    const user = await User.findOne({ _id: userIdParam }).select('+password').exec();
    if (!user) {
        return next(new AppError('User not found.', 404, 'ERR_USERS_NOT_FOUND'));
    }

    // Check if password is correct.
    const isMatch = await bcrypt.compare(passwordParam, user.password);
    if (!isMatch) {
        return next(new AppError('The password is incorrect.', 401, 'ERR_USERS_WRONG_PASSWORD'));
    }

    // Delete all vehicles associated with the user.
    await Vehicle.deleteMany({ userId: userIdParam }).exec();

    // Delete user from the database.
    const result = await User.deleteOne({ _id: userIdParam }).exec();
    if (result.deletedCount === 0) {
        return next(new AppError('Error when deleting the user.', 500, 'ERR_USERS_DELETE_FAILED'));
    }
    
    // Respond.
    res.status(204).send(); // With no body.

});
