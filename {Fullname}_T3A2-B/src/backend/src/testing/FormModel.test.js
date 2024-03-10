const { Form } = require('../models/FormModel');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('Form schema', () => {
    let mongoServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();

        await mongoose.connect(mongoUri)
    });

    afterEach(async () => {
        await Form.deleteMany();
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    it('should create a Form document', async () => {
        const formData = {
            description: 'Test Form Submission',
            formTemplate: new mongoose.Types.ObjectId(), 
            formData: { field1: 'value1', field2: 'value2' },
            user: new mongoose.Types.ObjectId(), 
            status: 'open',
            assignedTo: new mongoose.Types.ObjectId() 
        };

        // Create a Form document
        const createdForm = await Form.create(formData);

        // Check if the document exists in the database
        const retrievedForm = await Form.findById(createdForm._id);

        // Assertions
        expect(retrievedForm).toBeDefined();
        expect(retrievedForm.description).toBe('Test Form Submission');
        expect(retrievedForm.formTemplate).toEqual(formData.formTemplate);
        expect(retrievedForm.formData).toEqual(formData.formData);
        expect(retrievedForm.user).toEqual(formData.user);
        expect(retrievedForm.status).toBe('open');
        expect(retrievedForm.assignedTo).toEqual(formData.assignedTo);
    });
});

