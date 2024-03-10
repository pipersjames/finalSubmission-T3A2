const { User } = require('../models/UserModel');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcryptjs');

describe('User schema', () => {
    let mongoServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();

        await mongoose.connect(mongoUri)
    });

    afterEach(async () => {
        await User.deleteMany();
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    test('should create a User document with encrypted password', async () => {
        // Create a sample User data
        const userData = {
            fname: 'John',
            lname: 'Doe',
            email: 'john@example.com',
            password: 'password123',
            auth: 'user',
            favourites: []
        };

        // Create a User document
        const createdUser = await User.create(userData);

        // Check if the document exists in the database
        const retrievedUser = await User.findById(createdUser._id);

        // Assertions
        expect(retrievedUser).toBeDefined();
        expect(retrievedUser.fname).toBe('John');
        expect(retrievedUser.lname).toBe('Doe');
        expect(retrievedUser.email).toBe('john@example.com');
        expect(retrievedUser.auth).toBe('user');
        expect(retrievedUser.favourites).toEqual([]);
        
        // Check if password is hashed
        const isPasswordValid = await bcrypt.compare('password123', retrievedUser.password);
        expect(isPasswordValid).toBe(true);
    });
});
