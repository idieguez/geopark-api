const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require('../models/User');
const { AppError } = require('../utils/app-error');
const { catchAsync } = require('../utils/catch-async');

const { JWT_SECRET, JWT_EXPIRES_IN, LA_MAX_ATTEMPTS, LA_LOCK_TIME } = process.env;




/*
 * Register a new user.
 * POST /api/auth/register/
 */

exports.register = catchAsync(async (req, res, next) => {

    // Get parameters.
    const {
        name: nameParam,
        surname: surnameParam,
        secondSurname: secondSurnameParam,
        email: emailParam,
        password: passwordParam,
        newsletter: newsletterParam,
        notes: notesParam
    } = req.body;

    // Check if the email already exists.
    const existingUser = await User.findOne({ email: emailParam }).exec();
    if (existingUser) {
        return next(new AppError('The email address is already registered.', 409, 'ERR_AUTH_EMAIL_ALREADY_REGISTERED'));
    }

    // Hash the password before saving it.
    const hashedPassword = await bcrypt.hash(passwordParam, 12);

    // Create new user.
    const user = new User({
        name: nameParam,
        surname: surnameParam,
        secondSurname: secondSurnameParam,
        email: emailParam,
        password: hashedPassword,
        newsletter: newsletterParam,
        settings: { appearance: 'auto' },
        notes: notesParam,
        loginAttempts: 0,
        lockUntil: null,
        dateUserCreation: new Date(),
        dateLastUserModification: new Date(),
        dateLastPasswordModification: new Date()
    });

    // Save user in the database.
    await user.save();

    // Return user.
    res.status(201).json({
        status: 'success',
        data: {
            name: user.name,
            surname: user.surname,
            email: user.email
        }
    });

});




/*
 * Login a user.
 * POST /api/auth/login/
 */

exports.login = catchAsync(async (req, res, next) => {

    // Get parameters.
    const {
        email: emailParam,
        password: passwordParam,
    } = req.body;

    // Check if the email already exists.
    const existingUser = await User.findOne({ email: emailParam })
        .select('+password') // Also give me the password, even if it is private.
        .exec();
    if (!existingUser) {
        return next(new AppError('Invalid credentials.', 401, 'ERR_AUTH_INVALID_CREDENTIALS'));
    }

    // Check if the account is currently locked.
    if (existingUser.lockUntil && existingUser.lockUntil > new Date()) {
        return next(new AppError('Account locked due to too many failed login attempts. Please try again later.', 403, 'ERR_AUTH_ACCOUNT_LOCKED'));
    }

    // Compare the passwords.
    const isMatch = await bcrypt.compare(passwordParam, existingUser.password);

    // If the password is incorrect: update the lock counters and response.
    if (!isMatch) {
        existingUser.loginAttempts += 1;

        if (existingUser.loginAttempts >= LA_MAX_ATTEMPTS) {
            existingUser.lockUntil = new Date(Date.now() + LA_LOCK_TIME * 60 * 1000);
        }

        await existingUser.save();
        return next(new AppError('Invalid credentials.', 401, 'ERR_AUTH_INVALID_CREDENTIALS'));
    }

    // If the password is correct: reset the lock counters.
    existingUser.loginAttempts = 0;
    existingUser.lockUntil = null;
    await existingUser.save();

    // Generate a JWT token.
    const token = jwt.sign(
        { userId: existingUser._id }, // Payload data (user ID).
        JWT_SECRET, // JWT secret key.
        { expiresIn: JWT_EXPIRES_IN } // Token expiration.
    );

    // Return user.
    res.status(200).json({
        status: 'success',
        data: {
            _id: existingUser._id,
            name: existingUser.name,
            surname: existingUser.surname,
            secondSurname: existingUser.secondSurname,
            email: existingUser.email,
            newsletter: existingUser.newsletter,
            settings: existingUser.settings,
            notes: existingUser.notes,
            dateUserCreation: existingUser.dateUserCreation,
            dateLastUserModification: existingUser.dateLastUserModification,
            dateLastPasswordModification: existingUser.dateLastPasswordModification,
            token: token
        }
    });

});
