//import React, { useState } from 'react';

export default function FileUpload({ edit, index, handleInputChange, formData, submittedFormData, action }) {

  const handleFileChange = (event) => {
    const files = event.target.files; // Get the selected file(s)
    const value = files.length > 0 ? files[0].name : ''; // Get the name of the first selected file
    handleInputChange(index, value); // Pass the file name to handleInputChange
  }

  return (
    <div className="file-upload-component">
      <label>File Upload:</label>
      {action ? <p className="mt-2 border-bottom">{submittedFormData}</p> :
        <input
          type="file"
          disabled={edit}
          onChange={handleFileChange}
        />
      }
    </div>
  );
};
