
export default function FullNameInput({edit , index, handleInputChange, formData, submittedFormData, action}) {

  const value = formData && formData[index] !== undefined ? formData[index] : ''

  const handleFullNameChange = (event) => {
    const { value } = event.target
    handleInputChange(index, value)
     }

  return (
    <div>
      <div className="form-group">
        <label>Full Name:</label>
        {action ? <p className="mt-2 border-bottom">{submittedFormData} 
        </p>
        : <input
          type="text"
          className="form-control"
          id="fullName"
          value={value || ''}
          onChange={handleFullNameChange}
          placeholder=""
          disabled={edit}
        />}
        </div>
    </div>
  );
};

