const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FormTemplateSchema = new Schema({
    formName: {
        type: String,
        required: true,
        unique: true
    },
    assignedTo: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    components: {
        type: Array,
        required: true
    },
    questionHeaders: {
        type: Object
    }
});

const FormTemplate = mongoose.model('FormTemplate', FormTemplateSchema);

module.exports = {
    FormTemplate
};
