const { User } = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Environment variables for JWT.
const { JWT_SECRET, JWT_EXPIRES_IN, LA_MAX_ATTEMPTS, LA_LOCK_TIME } = process.env;




/*
 * Register a new user.
 * POST /api/auth/register/
 */

exports.register = async function (req, res) {

    let userId = null;

    try {

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
            return res.status(409).json({ message: `The email address is already registered.` });
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
        userId = user._id;

        // Return user.
        res.status(201).json({
            name: user.name,
            surname: user.surname,
            email: user.email
        });

    } catch (error) {

        // Delete the user if it was created.
        if (userId !== null) {

            try {

                console.log({ message: `Due to a failure during the generation of the JWT token, the user will be deleted.` });

                await User.findByIdAndDelete(userId);
                console.log({ message: `User deleted.` });

            } catch (error2) {

                console.error({ message: `Error when deleting the user: ${error2}` });

            }

        }

        // Log error.
        console.error({ message: `Error when creating the user: ${error}` });
        res.status(500).json({ message: `Error when creating the user.` });

    }

};




/*
 * Login a user.
 * POST /api/auth/login/
 */

exports.login = async function (req, res) {

    try {

        // Get parameters.
        const {
            email: emailParam,
            password: passwordParam,
        } = req.body;

        // Check if the email already exists.
        const existingUser = await User.findOne({ email: emailParam }).exec();
        if (!existingUser) {
            return res.status(401).json({ message: `Invalid credentials.` });
        }

        // Check if the account is currently locked.
        if (existingUser.lockUntil && existingUser.lockUntil > new Date()) {
            return res.status(403).json({ message: `Account locked due to too many failed login attempts. Please try again later.` });
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
            return res.status(401).json({ message: `Invalid credentials.` });
        }

        // If the password is correct: reset the lock counters.
        existingUser.loginAttempts = 0;
        existingUser.lockUntil = null;
        await existingUser.save();

        // Generate a JWT token.
        const token = jwt.sign(
            { userId: existingUser._id },       // Payload data (user ID).
            JWT_SECRET,                         // JWT secret key.
            { expiresIn: JWT_EXPIRES_IN }       // Token expiration.
        );

        // Return user.
        res.status(200).json({
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
        });

    } catch (error) {

        // Log error.
        console.error({ message: `Error during user login: ${error}` });
        res.status(500).json({ message: `Error during user login.` });

    }

};
