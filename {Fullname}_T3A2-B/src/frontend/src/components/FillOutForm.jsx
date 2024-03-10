import React, { useContext, useEffect, useState } from "react"
import { ApiContext } from "../contexts/ApiProvider"
import { FormTemplateContext } from "../contexts/FormTemplateProvider"
import Cookies from "js-cookie";
import FavouritesCheckBox from "./FavouritesCheckBox";


export default function FillOutForm({formName, formDescription, setCreatingForm, setFormDescription, renderedFormComponents, preview, fetchUserForms}) {
    //cookies
    const jwt = Cookies.get('jwt')
    //contexts
    const {apiUrl} = useContext(ApiContext)
    const {formComponents, formTemplate, fetchFormTemplate } = useContext(FormTemplateContext)
    //useStates
    const [formData, setFormData] = useState({});
  
    //handles
    const handleInputChange = (index, value) => {
        setFormData(prevData => ({
          ...prevData,
          [index]: value
        }));
      };

    let isSubmitting = false

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (Object.keys(formData).length === 0) {
            window.alert('please fill in the form before submitting')
            return; 
        }

        if (isSubmitting) {
            return
        } else {
            isSubmitting = true
        }

        const form = {
            description: formDescription,
            formTemplate: formTemplate._id,
            formData: formData,
            assignedTo: formTemplate.assignedTo
        }
        try {
            const response = await fetch(`${apiUrl}/forms/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    jwt : jwt
                },
                body: JSON.stringify(form)
            })

            if (response.ok) {
                setCreatingForm(false)
                setFormDescription('')
                fetchUserForms(formTemplate._id)
            } else {
                console.error('Form submission failed')
            }
        } catch (error) {
            console.error('Error submitting form', error)
        } finally {
            isSubmitting = false
        }  
    }
    //use Effects
    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchFormTemplate(formName, renderedFormComponents)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <div data-testid="fill-out-form-container" className="container">
            <div className="row justify-content-center mt-5">
                <div className="col-md-9"> 
                    {formTemplate && (
                        <div className=""> 
                            <div className="d-flex justify-content-center align-items-baseline mb-4"> 
                                <h1 className="text-md-center text-lg-left display-1 mx-3">{formName}</h1>
                                <FavouritesCheckBox formName={formName} preview={preview}/>
                            </div>
                                <div className="form-description-container">
                                    <h2 className="text-center border-bottom p-3">{formDescription}</h2>
                                </div>
                                {formTemplate.components && 
                                  formTemplate.components.map((component, index) => (
                                    <div key={index} className="mb-3"> 
                                        {React.createElement(formComponents[component], {
                                            fill : true, 
                                            index : index, 
                                            handleInputChange : handleInputChange, 
                                            formData : formData,
                                            questionHeader: formTemplate.questionHeaders[index]
                                            })}
                                    </div>    
                            ))}
                            <div className="d-flex justify-content-center">
                                <button onClick={handleSubmit} type="submit" className="btn btn-primary px-5" disabled={preview}>Submit</button> 
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}