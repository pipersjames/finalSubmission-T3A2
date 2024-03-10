import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import FileUpload from '../../components/formComponents/FileUpload';



describe('FileUpload component', () => {
  test('renders correctly and handles file change', () => {
    // Define mock props
    const edit = false;
    const index = 0;
    const handleInputChange = jest.fn();
    const formData = ['sample-file.txt']; // Sample form data
    const submittedFormData = 'sample-file.txt'; // Sample submitted form data
    const action = false;

    // Render the component
    const { getByText } = render(
      <FileUpload
        edit={edit}
        index={index}
        handleInputChange={handleInputChange}
        formData={formData}
        submittedFormData={submittedFormData}
        action={action}
      />
    );

    // Assert that the label is rendered
    // eslint-disable-next-line testing-library/prefer-screen-queries
    const labelElement = getByText('File Upload:');
    expect(labelElement).toBeInTheDocument();

    // Simulate file selection by changing the value
    // Mock file
    const file = new File(['file content'], 'sample-file.txt', { type: 'text/plain' });
    // eslint-disable-next-line testing-library/no-node-access
    const inputElement = document.querySelector('input[type="file"]');
    fireEvent.change(inputElement, { target: { files: [file] } });

    // Assert that the handleFileChange function is called with the correct parameters
    expect(handleInputChange).toHaveBeenCalledWith(index, 'sample-file.txt');
  });
});
