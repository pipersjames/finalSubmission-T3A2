const express = require('express');
const { Form } = require('../models/FormModel');
const { getUserIdFromToken } = require('../utils/userAuthFunctions');

const router = express.Router();

//get forms for current user
router.get('/currentUser', async (request, response) => {
  try {
    const id = getUserIdFromToken(request.headers.jwt)
    const result = await Form.find({user: id, formTemplate: request.headers.formid})
                              .populate('user', '-_id fname lname')
                              .populate('taskedUser', '-_id fname lname')
                              .populate({
                                path: 'formTemplate',
                                select: '-_id assignedTo',
                                populate: {
                                  path: 'assignedTo',
                                  model: 'User',
                                  select: '-_id fname lname'
                                }})
    if(!result || result.length === 0){
      return response.status(404).json({message:"completed forms not found"});
  }
    return response.json({result: result})
  } catch (error) {
    return response.status(500).json({message: "Internal server error"})
  }
})

router.get('/actions', async (request, response) => {
  try {
    const id = getUserIdFromToken(request.headers.jwt)

    const tasks = await Form.find({ taskedUser: id, status: {$ne: 'closed'} });
    const assignments = await Form.find({ assignedTo: id, status: {$ne: 'closed'} });

    if ((!tasks || tasks.length === 0) && (!assignments || assignments.length === 0)) {
      return response.status(404).json({ message: "Forms not found for the specified criteria" });
    }

    return response.json({ tasks: tasks, assignments: assignments });
  } catch (error) {
    return response.status(500).json({ message: "Internal server error" });
  }
});


router.get("/:id", async(request, response) => {
  try{
      let result = await Form.findById(request.params.id)
                              .populate('formTemplate')
                              .populate({
                                path: 'actions.sender',
                                select: '-_id'
                              })
      if(!result){
          return response.status(404).json({message:"Form not found"});
      }
      return response.json({result});
  }catch(error){
      return response.status(500).json({message: " Internal server error"});
  }
})


router.post('/submit', async (request, response) => {
  
  try {

    const { description,formTemplate, formData, assignedTo } = request.body;

    const id = getUserIdFromToken(request.headers.jwt)

      let newForm = await Form.create({
          description: description,
          formTemplate: formTemplate,
          formData: formData,
          user: id,
          assignedTo: assignedTo
      })

      response.status(201).json({
          newForm: newForm
      })
  } catch (error) {
      response.status(500).json({error: error.message})
  }
})

router.patch('/:formId', async (request, response) => {

  try {
    const {actions, ...restOfData} = request.body
    const updatedForm = await Form.findByIdAndUpdate(
      request.params.formId, 
      {
       $set: { ...restOfData},
       $push: {actions: actions}
      },
      {new: true} 
    )
    if (!updatedForm) {
      return response.status(404).json({ error: 'Form not found' }); 
    }
    const result = updatedForm.status
    response.json({ result: 'Form updated successfully', result });
  } catch (error) {
    response.status(500).json({ error: 'Internal server error' });
  }
})

// Export the router
module.exports = router;
