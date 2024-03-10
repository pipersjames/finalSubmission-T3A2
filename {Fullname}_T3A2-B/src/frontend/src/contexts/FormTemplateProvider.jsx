import { createContext, useContext, useState } from "react";
import FullNameInput from "../components/formComponents/FullNameInput";
import EmailInput from "../components/formComponents/EmailInput";
import ShortQA from "../components/formComponents/ShortQA";
import LongQA from "../components/formComponents/LongQA";
import FileUpload from "../components/formComponents/FileUpload";
import DateTimeInput from "../components/formComponents/DateTimeInput";
import { ApiContext } from "./ApiProvider";

export const FormTemplateContext = createContext();

export function FormTemplateProvider(props) {
    //contexts
    const {apiUrl} = useContext(ApiContext)
    //useStates
    const [formTemplate, setFormTemplate] = useState()

    const formComponents = {
        'Full Name' : FullNameInput,
        'Email' : EmailInput,
        'Short Question and Answer' : ShortQA,
        'Long Question and Answer' : LongQA,
        'File Upload' : FileUpload,
        'Date and Time' : DateTimeInput
    }

    const resetTemplateData = () => {
      setFormTemplate(null)
    }

    const fetchFormTemplate = async (formName, renderedFormComponents) => {
      if (renderedFormComponents === undefined) {
        try {
          const response = await fetch(`${apiUrl}/formTemplates/${formName}`);
          if (!response.ok) {
              throw new Error('Failed to fetch form template');
          }
          const data = await response.json();
          setFormTemplate(data.template);
      } catch (error) {
          console.error('Error fetching form template:', error);
      }
      } else {
        setFormTemplate(renderedFormComponents)
    } 
  };

  return (
    <FormTemplateContext.Provider value={{formComponents, fetchFormTemplate, formTemplate, setFormTemplate, resetTemplateData}}>
      {props.children}
    </FormTemplateContext.Provider>
  );
}