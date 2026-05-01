/*
 * File: seed.js
 * Function: Populates the MongoDB database with initial test data (users and vehicles).
 * It connects to the database, wipes existing data, creates new hashed users,
 * assigns vehicles to them, and then closes the connection.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const { User } = require('../../src/models/User');
const { Vehicle } = require('../../src/models/Vehicle');




/*
 * Main seed function.
 * Inputs: None.
 * Outputs: None (Executes database operations and logs to console).
 */

const seedDatabase = async () => {

    try {

        // Connect to the database.
        console.log('Connecting to database.');

        const {
            MONGODB_USER,
            MONGODB_PASSWORD,
            MONGODB_HOST,
            MONGODB_PORT,
            MONGODB_DATABASE,
            MONGODB_AUTH_SOURCE
        } = process.env;
        const mongoUri = `mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DATABASE}?authSource=${MONGODB_AUTH_SOURCE}`;

        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB successfully.');


        // Wipe existing data.
        console.log('Wiping existing data.');
        await User.deleteMany({});
        await Vehicle.deleteMany({});
        console.log('Old data cleared.');


        // Prepare passwords.
        const saltRounds = 12;
        const hashedAlejandro = await bcrypt.hash('alejandro.martinez.1', saltRounds);
        const hashedDavid = await bcrypt.hash('david.lopez.1', saltRounds);
        const hashedElena = await bcrypt.hash('elena.gomez.1', saltRounds);


        // Create Users.
        console.log('Creating users.');
        const userAlejandro = await User.create({
            name: 'Alejandro',
            surname: 'Martínez',
            secondSurname: 'Fernández',
            email: 'alejandro@example.com',
            password: hashedAlejandro,
            newsletter: true,
            settings: { appearance: 'auto' },
            notes: 'Password: alejandro.martinez.1',
            loginAttempts: 0,
            lockUntil: null,
            dateUserCreation: new Date(),
            dateLastUserModification: new Date(),
            dateLastPasswordModification: new Date()
        });

        const userDavid = await User.create({
            name: 'David',
            surname: 'López',
            secondSurname: 'Navarro',
            email: 'david@example.org',
            password: hashedDavid,
            newsletter: false,
            settings: { appearance: 'auto' },
            notes: 'Password: david.lopez.1',
            loginAttempts: 0,
            lockUntil: null,
            dateUserCreation: new Date(),
            dateLastUserModification: new Date(),
            dateLastPasswordModification: new Date()
        });

        const userElena = await User.create({
            name: 'Elena',
            surname: 'Gómez',
            secondSurname: null,
            email: 'elena@example.org',
            password: hashedElena,
            newsletter: true,
            settings: { appearance: 'auto' },
            notes: 'Password: elena.gomez.1',
            loginAttempts: 0,
            lockUntil: null,
            dateUserCreation: new Date(),
            dateLastUserModification: new Date(),
            dateLastPasswordModification: new Date()
        });
        
        console.log('Users created successfully.');


        // Create Vehicles.
        console.log('Creating vehicles.');
        
        // Alejandro's vehicles.
        await Vehicle.create([
            {
                licensePlate: '5109HPV',
                type: 'car',
                brand: 'Volvo',
                model: 'XC60',
                location: { latitude: 37.27306857848288, longitude: -6.923149456930193 },
                notes: null,
                userId: userAlejandro._id,
                dateVehicleCreation: new Date(),
                dateLastVehicleModification: new Date(),
                dateLastLocationModification: new Date()
            },
            {
                licensePlate: '6981JRS',
                type: 'car',
                brand: 'Volkswagen',
                model: 'Polo',
                location: { latitude: 37.19318157359817, longitude: -6.982959109658065 },
                notes: null,
                userId: userAlejandro._id,
                dateVehicleCreation: new Date(),
                dateLastVehicleModification: new Date(),
                dateLastLocationModification: new Date()
            },
            {
                licensePlate: '2980LHZ',
                type: 'motorbike',
                brand: 'Honda',
                model: 'Africa Twin Adventure Sports',
                location: { latitude: 37.25401630395776, longitude: -6.952641038711562 },
                notes: null,
                userId: userAlejandro._id,
                dateVehicleCreation: new Date(),
                dateLastVehicleModification: new Date(),
                dateLastLocationModification: new Date()
            }
        ]);

        // David's vehicles.
        await Vehicle.create({
            licensePlate: '4821LKM',
            type: 'motorbike',
            brand: 'Vespa',
            model: '125',
            location: { latitude: 37.25835982201014, longitude: -6.923886961472119 },
            notes: null,
            userId: userDavid._id,
            dateVehicleCreation: new Date(),
            dateLastVehicleModification: new Date(),
            dateLastLocationModification: new Date()
        });

        // Elena's vehicles.
        await Vehicle.create([
            {
                licensePlate: '9056JHB',
                type: 'car',
                brand: 'Opel',
                model: 'Zafira Tourer',
                location: { latitude: 37.200322458419926, longitude: -6.920261689447417 },
                notes: null,
                userId: userElena._id,
                dateVehicleCreation: new Date(),
                dateLastVehicleModification: new Date(),
                dateLastLocationModification: new Date()
            },
            {
                licensePlate: '5319MPV',
                type: 'car',
                brand: 'Toyota',
                model: 'RAV4',
                location: { latitude: 37.20910415333802, longitude: -6.77537976066862 },
                notes: null,
                userId: userElena._id,
                dateVehicleCreation: new Date(),
                dateLastVehicleModification: new Date(),
                dateLastLocationModification: new Date()
            }
        ]);

        console.log('Vehicles created successfully.');


        // Close connection.
        console.log('Closing database connection.');
        await mongoose.connection.close();
        console.log('Seed completed successfully!');

        
    } catch (error) {

        console.error('Error during database seeding:', error);
        process.exit(1);

    }

};




// Execute the function.
seedDatabase();
