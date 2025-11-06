const { User } = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Environment variables for JWT.
const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;




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
            return res.status(400).json({ message: `Invalid credentials.` });
        }

        // Compare the passwords.
        const isMatch = await bcrypt.compare(passwordParam, existingUser.password);
        if (!isMatch) {
            return res.status(400).json({ message: `Invalid credentials.` });
        }

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
