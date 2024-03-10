const { FormTemplate } = require('../models/FormTemplateModel');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('FormTemplate schema', () => {
    let mongoServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();

        await mongoose.connect(mongoUri)
    });

    afterEach(async () => {
        await FormTemplate.deleteMany();
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    test('should create a FormTemplate document', async () => {
        // Create a sample FormTemplate data
        const formTemplateData = {
            formName: 'Test Form',
            assignedTo: new mongoose.Types.ObjectId(),
            components: ['Component 1', 'Component 2'],
            questionHeaders: { header1: 'Header 1' }
        };

        // Create a FormTemplate document
        const createdFormTemplate = await FormTemplate.create(formTemplateData);

        // Check if the document exists in the database
        const retrievedFormTemplate = await FormTemplate.findById(createdFormTemplate._id);

        // Assertions
        expect(retrievedFormTemplate).toBeDefined();
        expect(retrievedFormTemplate.formName).toBe('Test Form');
        expect(retrievedFormTemplate.assignedTo).toEqual(formTemplateData.assignedTo);
        expect(retrievedFormTemplate.components).toEqual(expect.arrayContaining(formTemplateData.components));
        expect(retrievedFormTemplate.questionHeaders).toEqual(formTemplateData.questionHeaders);
    });
});