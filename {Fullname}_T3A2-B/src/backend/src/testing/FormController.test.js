const request = require('supertest')
const {User} = require('../models/UserModel');
const { FormTemplate } = require("../models/FormTemplateModel")
const { Form } = require("../models/FormModel")
const {app} = require('../server');
const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')
const {generateJwt} = require('../utils/userAuthFunctions')

let mongoServer
let user
let authToken
let newFormTemplate
let form
let user1

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

        user1 = new User({
            fname: 'test1',
            lname: 'test1',
            email: 'test@exampl.com',
            password: 'password!2', 
            auth: 'user' 
        });
        await user1.save();

        newFormTemplate = new FormTemplate({
            formName: 'testFormTemplate',
            assignedTo: user._id,
            components: ['comp1', 'comp2'],
            questionHeaders: {0: 'password!1'} 
        });
        await newFormTemplate.save();

        form = new Form({
            description: 'testForm',
            formTemplate: newFormTemplate._id,
            formData: {0: 'data'},
            user: user._id,
            assignedTo: user._id
        })
    
        await form.save();  
        mockJwt = generateJwt(user1._id.toString())
         authToken = generateJwt(user._id.toString());

         jest.spyOn(console, 'error').mockImplementation(() => {});
})

afterAll(async () => {

    await mongoose.disconnect()
    await mongoServer.stop()
    console.error.mockRestore();
    
});


describe('GET /currentUser', () => {
    test('should get forms for current user', async () => {

      const res = await request(app)
        .get('/forms/currentUser')
        .set('jwt', authToken)
        .set('formid', newFormTemplate._id);
      expect(res.statusCode).toEqual(200);
    });
    test('should return 404 form doesn\'t exist', async () => {
        const res = await request(app)
          .get('/forms/currentUser')
          .set('jwt', authToken)
          .set('formid', new mongoose.Types.ObjectId('123456789123456789123456'));
        expect(res.statusCode).toEqual(404);
        expect(res.body).toEqual({message:"completed forms not found"})
      });
      test('should return 500 from incorrect data type', async () => {
        const res = await request(app)
          .get('/forms/currentUser')
          .set('jwt', authToken)
          .set('formid', 'non-form');
        expect(res.statusCode).toEqual(500);
        expect(res.body).toEqual({message: "Internal server error"})
      });
    
  
  });
  
  describe('GET /actions', () => {
    test('should get tasks and assignments for current user', async () => {
      const res = await request(app)
        .get('/forms/actions')
        .set('jwt', authToken);
      expect(res.statusCode).toEqual(200);
    });
    test('should return 404 if no tasks or assignments are found', async () => {
        const res = await request(app)
          .get('/forms/actions')
          .set('jwt', mockJwt);
        expect(res.statusCode).toEqual(404);
    })
    test('internal server error response 500', async () => {

        const find = jest.spyOn(Form, 'find');
    find.mockImplementation(() => {
        throw new Error('Database error');
    });

        const res = await request(app)
          .get('/forms/actions')
          .set('jwt', mockJwt);
        expect(res.statusCode).toEqual(500);
    })
  });
  
  describe('GET /:id', () => {
    test('should get form by ID', async () => {
      const res = await request(app)
        .get(`/forms/${form._id}`);
      expect(res.statusCode).toEqual(200);

    });
  
  });
  
  describe('POST /submit', () => {
    test('should submit a new form', async () => {
      const res = await request(app)
        .post('/forms/submit')
        .send({
          description: 'Test description',
          formTemplate: newFormTemplate._id,
          formData: { 0: 'value' },
          assignedTo: user._id
        })
        .set('jwt', authToken);
      expect(res.statusCode).toEqual(201);

    });
  
  });
  
  describe('PATCH /:formId', () => {
    test('should update a form', async () => {
      const res = await request(app)
        .patch(`/forms/${form._id}`)
        .send({
        })
        .set('jwt', authToken);
      expect(res.statusCode).toEqual(200);
    });
  
  });
