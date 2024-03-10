// models/FormSubmission.js
const mongoose = require('mongoose');

const FormSchema = new mongoose.Schema({
  // Define the schema fields for form submissions
  description: {
    type: String,
    required: true  
  },
  formTemplate: {
    type: mongoose.Types.ObjectId,
    ref: 'FormTemplate',
    required: true,
  },
  formData: {
    type: Object,
    required: true
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timeStamp: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['open', 'pending action', 'closed'],
    default: 'open'
  },
  actions: [{
    message: {
      type: String,
      required: true
  },
  sender: {
      type: mongoose.Types.ObjectId,
      ref: 'User', 
      required: true
  },
  timestamp: {
      type: Date, 
      default: Date.now 
  }
  }],
  taskedUser: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  assignedTo: {
    type: mongoose.Types.ObjectId,
    required: true
}

});

const Form = mongoose.model('Form', FormSchema);

module.exports = {
    Form
};
