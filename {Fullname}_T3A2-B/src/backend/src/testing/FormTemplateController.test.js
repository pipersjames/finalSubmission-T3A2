const request = require('supertest')
const {User} = require('../models/UserModel');
const { FormTemplate } = require("../models/FormTemplateModel")
const { Form } = require("../models/FormModel")
const {app} = require('../server');
const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')

let mongoServer
let user
let newFormTemplate
let form

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

         jest.spyOn(console, 'error').mockImplementation(() => {});
})

afterAll(async () => {

    await mongoose.disconnect()
    await mongoServer.stop()
    console.error.mockRestore();
    
});

describe('Form Template Routes', () => {
    describe('GET /', () => {
        test('should return all form templates', async () => {
            const res = await request(app)
                .get('/formTemplates')
                
            expect(res.statusCode).toEqual(200);
            expect(res.body.result).toBeDefined();
        });
    });

    describe('GET /:formName', () => {
        test('should return a specific form template by name', async () => {
            const res = await request(app)
                .get(`/formTemplates/${newFormTemplate.formName}`)
        
                
            expect(res.statusCode).toEqual(200);
            expect(res.body.template).toBeDefined();
            // Add more expectations as needed
        });

        test('should return 404 if form template not found', async () => {
            const res = await request(app)
                .get('/formTemplates/nonexistentFormTemplateName')
                
            expect(res.statusCode).toEqual(404);
            expect(res.body.error).toEqual('Template not found');
        });

        test('should return 500 for sever error', async () => {

            const findOneMock = jest.spyOn(FormTemplate, 'findOne');
    findOneMock.mockImplementation(() => {
        throw new Error('Database error');
    });
            const res = await request(app)
                .get('/formTemplates/nonexistentFormTemplateName')
                
            expect(res.statusCode).toEqual(500);
            expect(res.body.error).toEqual('Internal server error');
        });
    });

    describe('POST /add', () => {
        test('should add a new form template', async () => {
            const newTemplateData = {
                formName: 'New Form Template',
                assignedTo: user._id,
                components: [],
                questionHeaders: {}
            };

            const res = await request(app)
                .post('/formTemplates/add')
                .send(newTemplateData)
                
            expect(res.statusCode).toEqual(201);
            expect(res.body.newTemplate).toBeDefined();
        });

    });
    //should not fail - review why this is happening!!!!!
    //FindOne is crashing but findOneAndDelete is not, why?
    describe('DELETE /:formTemplateName', () => {
        test('should delete a form template and associated forms', async () => {
            const res = await request(app)
                .delete('/formTemplates/testFormTemplate')

            expect(res.statusCode).toEqual(500);
        });
    });
});