
export default function EmailInput({edit , index, handleInputChange, formData, submittedFormData, action}){

  const value = formData && formData[index] !== undefined ? formData[index] : ''

  const handleEmailChange = (event) => {
    const { value } = event.target
    handleInputChange(index, value)
     }

  return (
    <div>
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        {action ? <p className="mt-2 border-bottom">{submittedFormData}</p>
          : <input
          type="email"
          className="form-control"
          id="email"
          value={value || ''}
          onChange={handleEmailChange}
          placeholder=""
          disabled={edit}
        />
  }
        </div>
    </div>
  );
};