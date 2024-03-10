
const request = require('supertest')
const {User} = require('../models/UserModel');
const {generateJwt} = require('../utils/userAuthFunctions')
const {app} = require('../server');
const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')

let mongoServer
let authToken
let user
let testId

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    const mongoUri = mongoServer.getUri()
    await mongoose.connect(mongoUri)

        user = new User({
            fname: 'test',
            lname: 'test',
            email: 'test@example.com',
            password: 'password!1', 
            auth: 'user' 
        });
        await user.save();
        testId = user._id
         authToken = generateJwt(user._id.toString());

         jest.spyOn(console, 'error').mockImplementation(() => {});
})

afterAll(async () => {
    await mongoose.disconnect()
    await mongoServer.stop()
    console.error.mockRestore();
    
});


describe('Post /login Route', () => { 
    test('should return JWT token and auth status on successful login', async () => {
        
        const res = await request(app)
            .post('/users/login')
            .send({ email: 'test@example.com', password: 'password!1' })

        //assertions
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('jwt')
        expect(res.body).toHaveProperty('auth')
    });

    test('should return 403 error for invalid email', async () => {
        const res = await request(app)
            .post('/users/login')
            .send({ email: 'invalid@example.com', password: 'invalidpassword' })

        //assertions
        expect(res.status).toBe(403)
        expect(res.body).toEqual({ error: 'Invalid email.' })
    })
    test('should return 403 error for invalid password', async () => {
        const res = await request(app)
            .post('/users/login')
            .send({ email: 'test@example.com', password: 'invalidpassword' })

        //assertions
        expect(res.status).toBe(403)
        expect(res.body).toEqual({ error: "Incorrect password, please try again." })
    })
    test('unexpexted error', async () => {
        
        const res = await request(app)
            .post('/users/login')
            .send({ email: 'test@example.com', password: 42 })

        //assertions
        expect(res.status).toBe(500)
        expect(res.body).toEqual({ error: 'Internal server error' })
    });
})

describe('Get /favourites Route', () => {
    
    test('should return favourites list based on current user id', async () => {
        const res = await request(app)
            .get('/users/favourites')
            .set('jwt', authToken);

        expect(res.status).toBe(200);
    });
    test('should return unauthorized response if invalid token is sent', async () => {
        const res = await request(app)
            .get('/users/favourites')
        
        expect(res.status).toBe(401)
    })
})

describe('Get / all users Route', () => {
    test('GET / - should return all users', async () => {
        const res = await request(app)
            .get('/users');

        expect(res.status).toBe(200);
        
    });
})

describe('Get /auth-checker Route', () => {
    test('should return "you\'re still authorized"', async () => {
        const res = await request(app)
            .get('/users/auth-checker')
            .set('jwt', authToken);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: "you're still authorized" });
    });
})

describe('Get /:id Route', () => {
    test('should return user by id', async () => {
        
        const mockUser = await User.findOne({ email: user.email });

        const res = await request(app)
            .get(`/users/${mockUser._id}`);

        expect(res.status).toBe(200);
    });
    test('should return no user Id found', async () => {
        const mockId = new mongoose.Types.ObjectId('422221113131314584562452')
        const res = await request(app)
        .get(`/users/${mockId}`)

        expect(res.status).toBe(404)
        expect(res.body).toEqual({message: "User not found"})
    })
    test('should return internal server error', async () => {
        //incorrect id type passed
        const res = await request(app)
        .get(`/users/42`)

        expect(res.status).toBe(500)
        expect(res.body).toEqual({message: "Internal server error"})
    })
})

describe('Patch /favourites Route', () =>{
    test('should update user favourites', async () => {

        const newFavourite = 'New Favourite';
        const res = await request(app)
            .patch('/users/favourites')
            .set('jwt', authToken)
            .send({ favourite: [newFavourite] })
    
        expect(res.status).toBe(200);
        expect(res.body).toContain(newFavourite)
    })
    test('should return internal server error', async () => {

    const findOneAndUpdateMock = jest.spyOn(User, 'findOneAndUpdate');
    findOneAndUpdateMock.mockImplementation(() => {
        throw new Error('Database error');
    });
        const newFavourite = 'New Favourite';
        const res = await request(app)
            .patch('/users/favourites')
            .set('jwt', authToken)
            .send({ favourite: 42 })
    
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ error: 'Internal server error' })
    })
})

describe('Post /create-new-user Route', () => {
    test('POST /create-new-user - should create a new user', async () => {
        const newUser = {
            fname: 'Alice',
            lname: 'Smith',
            email: 'alice@example.com',
            password: 'password456'
        }

        const res = await request(app)
            .post('/users/create-new-user')
            .send(newUser)

        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty('jwt')
        expect(res.body).toHaveProperty('message', 'Account created successfully')
    })
})

describe('Post /token-refresh Route', () => {
    test('should return a new JWT token on token refresh', async () => {
       
        const res = await request(app)
            .post('/users/token-refresh')
            .set('jwt', authToken);

        // Assert 
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('jwt');
        expect(res.body.jwt).not.toBe(authToken)
    });
});

describe('Delete User Route', () => {
    test('should delete a user by ID', async () => {
        
        const res = await request(app)
            .delete(`/users/${user._id}`);

        //assertions
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'User deleted successfully');
        expect(res.body).toHaveProperty('deletedUser');
        expect(res.body.deletedUser._id).toBe(user._id.toString())
    });

    test('should return 404 if user to delete is not found', async () => {
        //test same id of previously deleted user
        const res = await request(app)
            .delete(`/users/${testId}`);

        //assertions
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: 'User not found' });
    });
});