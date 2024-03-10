import React, { useContext, useEffect, useState } from "react"
import { ApiContext } from "../contexts/ApiProvider"
import { FormTemplateContext } from "../contexts/FormTemplateProvider"
import { useNavigate, useParams } from "react-router-dom"
import lineImage from '../assets/divider.png';
import Select from 'react-select'
import ActionsMenu from "../components/ActionsMenu";
import moment from "moment";


export default function CompletedForm() {
  //navigation
  const navigate = useNavigate()
  //params
  const { id } = useParams()
  //contexts
  const {apiUrl} = useContext(ApiContext)
  const {formComponents } = useContext(FormTemplateContext)
  //useStates
  const [formId, setFormId] = useState(id || '')
  const [formData, setFormData] = useState(null);
  const [status, setStatus] = useState('')
  const [assignedTo, setAssignedTo] = useState()
  const [assignedOptions, setAssignedOptions] = useState()
  const [message, setMessage] = useState("")
  //Api Calls
  const fetchForm = async () => {
      try {
        const response = await fetch(`${apiUrl}/forms/${formId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch form template data');
        }
        const data = await response.json();
        setFormData(data.result);
        setStatus(data.result.status)
      } catch (error) {
        console.error("Error fetching form template data:", error);
      }
    };

    const fetchUsernamesFromDatabase = async () => {
      const response = await fetch(`${apiUrl}/users/`)
      const data = await response.json()
      const userNames = data.result.map(user => ({
        value: `${user._id}`,
        label: `${user.fname} ${user.lname}`
      }))
      setAssignedOptions(userNames)
    };
    //handles
    const handleAssignedToChange = (selectedOption) => {
      setAssignedTo(selectedOption);
    };

    const handleMessageChange = (event) => {
      setMessage(event.target.value)
    }
    
    const handleCloseForm = async () => {
      try {
        const response = await fetch (`${apiUrl}/forms/${formId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: 'closed'
          })
        })
        if (!response.ok) {
          throw new Error('failed to close the form')
        }
        const data = await response.json()
        console.log(data.result)
        setStatus(data.result)
        setFormId('')
        setFormData(null)
        navigate('/actions')
      } catch (error) {
        console.error("Error closing the form")
      }
    }

    const handleReassign = async (event) => {
      event.preventDefault()

      if (!message.trim()) {
        window.alert("missing comment");
        return;
      }

      if (!assignedTo) {
        window.alert('missing assigned user')
        return
      }

      try {
        const response = await fetch (`${apiUrl}/forms/${formId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: 'pending action',
            taskedUser: assignedTo.value,
            actions: {
              message: message,
              sender: formData.user
            }  
          })
        })
        if (!response.ok) {
          throw new Error(`failed to re-assign the form. Status: ${response.status}`)
        }
        const data = await response.json()
        console.log(data.result, 'complete')
        setStatus(data.result)
        setFormId('')
        setFormData(null)
      } catch (error) {
        console.error("Error re-assigning the form")
      }
    }

    const handleClosedFormReturn = () => { 
      setFormData(null)
    }
    
    // useEffects
    useEffect(() => {
      if(!formId){
        return
      }
      const fetchFormData = async () => {
        await fetchForm();
        await fetchUsernamesFromDatabase();
      };
      fetchFormData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[formId])

    //tablerender formats
  
  return (
      <div className="container">
          <div className="row justify-content-center mt-5">
            <div className={formData ? 'col-md-3' : 'col-md-6'}>
              <ActionsMenu setFormId={setFormId}/>
              
            </div>
              <div className="col-md-9"> 
              
                  {formData && (
                      <div className=""> 
                          <div className="d-flex justify-content-center align-items-baseline mb-4"> 
                              <h1 className="text-md-center text-lg-left display-1 mx-3">{formData.formTemplate.formName}</h1>
                          </div>
                              <div className="form-description-container">
                                  <h2 className="text-center border-bottom p-3">{formData.formTemplate.formDescription}</h2>
                              </div>
                              {formData.formTemplate.components && 
                                formData.formTemplate.components.map((component, index) => (
                                  <div key={index} className="mb-3"> 
                                      {React.createElement(formComponents[component], {
                                          fill : true,
                                          action : true, 
                                          index : index, 
                                          handleInputChange : '', 
                                          formData : formData,
                                          submittedFormData: formData.formData[index],
                                          questionHeader: formData.formTemplate.questionHeaders[index]
                                          })}
                                  </div>      
                          ))}
                          <h2 className="text-center">End</h2>
                          {formData.actions && formData.actions.map((action, index) => (
                            <div key={index} className="mb-3">
                                  <h5>comment {index+1}</h5>
                                  <p>{action.message}</p>
                                  <p>{action.sender.fname}, {moment(action.timestamp).format('h:mm a - MMM Do YYYY')}</p>
                                </div>
                          ))}
                          {formData && (
                            <div className="text-center">
                              <div>
                                <img src={lineImage} alt="line" className="img-fluid" />
                              </div>
                              {status === 'closed' ? (
                                <button type="button" onClick={handleClosedFormReturn} className="btn btn-primary px-5">
                                  Return
                                </button>
                              ) : (
                                <>
                                  <label>Add Comment Here</label>
                                  <textarea 
                                  className="form-control mb-4"
                                  value={message}
                                  onChange={handleMessageChange}>
                                  </textarea>
                                  <div className="d-flex flex-column align-items-center">
                                    <div className="col-md-6 mb-3 d-flex flex-column align-items-center">
                                      <label htmlFor="assignedTo">Request action from:</label>
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
                                      <div className="mt-3">
                                        <button type="submit" onClick={handleReassign} className="btn btn-primary btn-block">
                                          Re-assign
                                        </button>
                                        <button onClick={handleCloseForm} type="button" className='btn btn-secondary btn-block'>
                                          Close Form
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                      </div>
                  )}
              </div>
          </div>
      </div>
  )
}