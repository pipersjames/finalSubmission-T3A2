
export default function DateTimeInput({edit, index, handleInputChange, formData, submittedFormData, action}) {
  
  const value = formData && formData[index] !== undefined ? formData[index] : ''

  const handleDateTimeChange = (event) => {
    const { value } = event.target
    handleInputChange(index, value)
     }


  return (
    <div>
        <label>Date and Time:</label>
          <div>
          {action ? <p className="mt-2 border-bottom">{submittedFormData}</p>
          : 
          <input 
            type="datetime-local" 
            value={value || ''} 
            onChange={handleDateTimeChange} 
            disabled={edit}
          />
  }
          </div>
    </div>
  );
};

