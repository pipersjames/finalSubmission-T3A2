import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';

const ShortQA = ({ 
  setQuestionHeaders, 
  edit, 
  fill, 
  index,
  handleInputChange, 
  formData, 
  questionHeader, 
  submittedFormData, 
  action
}) => {
  
  const [title, setTitle] = useState(questionHeader || '');
  const [editMode, setEditMode] = useState(edit);
  const [placeHolder, setPlaceHolder] = useState('')
  const maxCharacters = 28;
  const value = formData && formData[index] !== undefined ? formData[index] : ''

  // component render
  useEffect(() => {
    if (editMode) {
      setPlaceHolder('Answer')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  // Function to handle title change
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  // Function to handle description change
  const handleDescriptionChange = (event) => {
    
    const { value } = event.target
      if (value.length <= maxCharacters) {
        handleInputChange(index, value)
      } else {
        // Truncate the description if it exceeds the character limit
        const truncatedValue = value.slice(0, maxCharacters);
        handleInputChange(index, truncatedValue);
    }
  };

  // Function to handle saving both title and description
  const handleSave = () => {
    setEditMode(false); // Exit edit mode after saving
    setQuestionHeaders((prevHeaders) => ({...prevHeaders, [index]: title}));
  };

  // Function to enable editing when the pencil icon is clicked
  const handleEditClick = () => {
    setEditMode(true);
  };

  return (
    <div className="form-group">
      {/* Input field for both title and description */}
      <div>
        {fill && <label>{title}</label>}
        {!fill && <input
          type='text'
          className="form-control mb-2"
          value={title}
          placeholder='Enter Question Here'
          onChange={handleTitleChange}
          disabled={!editMode} // Disable editing if not in edit mode
        />}
        {action ? (<p className="mt-2 border-bottom">{submittedFormData}</p>)
          : (!editMode && (
          <input
            className="form-control"
            value={value || ''}
            onChange={handleDescriptionChange}
            rows="3"
            placeholder={placeHolder || 'Answer'}
            disabled={!fill} 
          />)
        )}
      </div>
      {/* Show Save button when in edit mode */}
      {editMode && (
        <button className="btn btn-sm btn-primary mt-1 mr-2 w-100" onClick={handleSave}>
          Save
        </button>
      )}
      {/* Show pencil icon to enable editing */}
      {!editMode && !fill && (
        <FontAwesomeIcon icon={faPencilAlt} className="text-muted ml-2" onClick={handleEditClick} />
      )}
    </div>
  );
};

export default ShortQA;
