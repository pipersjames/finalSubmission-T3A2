import React, { useState, useEffect, useCallback, useContext } from 'react';
import Layout from '../components/Layout';
import SelectionTable from '../components/FormBuilderSelections';
import { ApiContext } from "../contexts/ApiProvider"
import { FormTemplateContext } from '../contexts/FormTemplateProvider';
import Select from 'react-select'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router';
import { Modal, Col, Row } from 'react-bootstrap';
import FillOutForm from '../components/FillOutForm';
import { Button } from 'antd';


const FormBuilder = () => {
  //cookies
  const auth = Cookies.get('auth')
  //navigation
  const navigate = useNavigate()
  //Context
  const { apiUrl } = useContext(ApiContext)
  const { formComponents, resetTemplateData } = useContext(FormTemplateContext)
  // State variables
  const [formName, setFormName] = useState('');
  const [accordionItems, setAccordionItems] = useState([]);
  const [renderedFormComponents, setRenderedFormComponents] = useState([]); // State to store form components
  const [assignedTo, setAssignedTo] = useState(); // State for assignedTo input value
  const [assignedOptions, setAssignedOptions] = useState([]) // options for assigned dropdown filter
  const [questionHeaders, setQuestionHeaders] = useState([])
  const [showOverlay, setShowOverlay] = useState(false);
  const [ previewTemplate, setPreviewTemplate] = useState({})
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  
  //Api functions
  const fetchUsernamesFromDatabase = async () => {
    try {
      const response = await fetch(`${apiUrl}/users/`);
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      const userNames = data.result.map(user => ({
        value: `${user._id}`,
        label: `${user.fname} ${user.lname}`
      }));
      setAssignedOptions(userNames);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  

  // useEffects
  useEffect(() => {
    if (auth !== 'admin' && auth !== 'manager'){
      navigate('/')
    }
    fetchUsernamesFromDatabase()
    setAccordionItems([...Object.keys(formComponents)]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  //handles
  const handleFormNameChange = (event) => {
    setFormName(event.target.value);
  };

  const handleAssignedToChange = (selectedOption) => {
    setAssignedTo(selectedOption);
  };


const handleToggleOverlayPreview = () => {
  resetTemplateData() 
  setPreviewTemplate({
      formName: formName,
      assignedTo: assignedTo ? assignedTo.value : '',
      components: renderedFormComponents.map((comp => comp.componentName)),
      questionHeaders: questionHeaders
  });

  setShowOverlay(!showOverlay);
};

  const handleAddComponent = useCallback((componentName) => {
    //console.log("Adding component:", componentName); // log the component name, troubleshooting
    // Determine the component type based on the component name
    const componentArray = formComponents[componentName]
     

    setRenderedFormComponents([
      ...renderedFormComponents, 
      { 
        componentName: componentName,
        type: componentArray, 
        key: renderedFormComponents.length,
        index: renderedFormComponents.length, 
        edit: true,
        setQuestionHeaders: setQuestionHeaders
      }
    ]
  );
  //console.log(renderedFormComponents)// log rendered components
}, [formComponents, renderedFormComponents, setQuestionHeaders])

  
  // Function to handle deleting a component from the form
  const handleDeleteComponent = (index) => {
    setRenderedFormComponents(renderedFormComponents.filter((_, i) => i !== index));

    const updatedQuestionHeaders = { ...questionHeaders };
    for (const key in updatedQuestionHeaders) {
        if (parseInt(key) === index) {
            delete updatedQuestionHeaders[key];
            break
        }
    }
    setQuestionHeaders(updatedQuestionHeaders);
  };
  //reset all components
  const handleReset = (event) => {
    setRenderedFormComponents([])
    setFormName('')
    setAssignedTo('')
  }

    // Function to handle form submission
    const handleCreateFormTemplate = async () => {
      
      if (!formName) {
        window.alert('The Form Needs a Name')
        return
      }

      if (!assignedTo) {
        window.alert('The Form needs an Assigned User')
        return
      }

      const components = renderedFormComponents.map((comp => comp.componentName))
      if (components.length < 1) {
        window.alert('Must have atleast 1 form component added to Save a Template')
        return
      }
      console.log(components)

      const formTemplate = {
        formName: formName,
        assignedTo: assignedTo.value,
        components: components,
        questionHeaders: questionHeaders
      };

      //console.log(formTemplate) //troubleshooting
    
      try {
      
        const response = await fetch(`${apiUrl}/formTemplates/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formTemplate)
        });
    
        if (response.ok) {
          // Form submitted successfully, clear the form
          setFormName('');
          setAssignedTo('');
          setRenderedFormComponents([]);
          setQuestionHeaders([])
          console.log('Form template created successfully');
          setIsConfirmationModalOpen(true)
        } else {
          // Handle error
          console.error('Form template creation failed');
        }
      } catch (error) {
        console.error('Error creating form:', error);
      }
    };

    
  return (
    <Layout>
      <div className="container mx-1 text-center">
        <Row className='d-flex justify-content-end'>
        <Col xs={12} sm={12} md={12} lg={8}> 
          <h1 className='text-center'>Build a New Form</h1>
          <p>Select Elements from the Left Pane to Include in your Form. When you are done, preview the form and save the new template if you are happy with your creation.</p>
        </Col>
        </Row>
        <div className="row ">
          <div className="col-md-4 d-flex justify-content-center">
            <SelectionTable items={accordionItems} onItemClick={handleAddComponent} />
          </div>
          <div className="col-md-8">
            <div className="row justify-content-around">
              <div className='mb-4'>
                <button className='btn btn-secondary float-left' onClick={handleReset}>Reset</button>
              </div>
              <div className="col-md-6 mb-3">
                <div className="form-group">
                  <label htmlFor="formName" className='fw-bold'>Form Name:</label>
                  <input
                    type="text"
                    className="form-control text-center"
                    id="formName"
                    value={formName}
                    onChange={handleFormNameChange}
                  />
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="form-group">
                  <label htmlFor="assignedTo" className='fw-bold'>Assigned To:</label>
                  <Select
                    className="basic-single"
                    id="assignedTo"
                    value={assignedTo}
                    onChange={handleAssignedToChange}
                    options={assignedOptions}
                    placeholder="Select a User"
                    isClearable
                    isSearchable
                  />
                </div>
              </div>
              {/* Render added form components */}
              {renderedFormComponents.map((component, index) => (
                <div key={index} className="col-md-5 mb-3 border rounded m-2 d-flex flex-column">
                  <p className='text-start fw-bold'>{index+1}</p>
                  {/* Render the component */}
                  {React.createElement(
                    component.type, 
                    {  
                      key: component.key, 
                      edit: component.edit, 
                      setQuestionHeaders: component.setQuestionHeaders, 
                      index: component.index
                    })}

                  {/* Render delete button for each component */}
                  <button className="btn btn-sm btn-primary mt-1 mb-2" onClick={() => handleDeleteComponent(index)}>Remove</button>
                </div>
              ))}
              <div className="row mt-3">
                <div className="col-md-12 text-center">
                <button className='btn btn-secondary mx-2' onClick={handleToggleOverlayPreview}>Preview Form</button>
                  <button className="btn btn-primary" onClick={handleCreateFormTemplate}>Save Template</button>
                  
                  <div>
                    <Modal show={showOverlay} onHide={handleToggleOverlayPreview} backdrop="static">
                      <Modal.Header closeButton>
                        <Modal.Title>Overlay Title</Modal.Title>
                          </Modal.Header>
                            <Modal.Body>
                              <FillOutForm 
                                formName={formName} 
                                renderedFormComponents={previewTemplate}
                                preview={true}
                                />
                            </Modal.Body>
                            <Modal.Footer>
                              <button onClick={handleToggleOverlayPreview}>Close</button>
                            </Modal.Footer>
                          </Modal>
                    </div>
                    <Modal show={isConfirmationModalOpen} onHide={() => setIsConfirmationModalOpen(false)}>
                      <Modal.Header closeButton>
                        <Modal.Title>Success!</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <p>You have created a new Template. Check it out on the Forms Page.</p>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={() => setIsConfirmationModalOpen(false)}>Close</Button>
                      </Modal.Footer>
                    </Modal>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </Layout>
  );
};

export default FormBuilder;


