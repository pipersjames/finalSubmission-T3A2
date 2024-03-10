import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import FullNameInput from '../../components/formComponents/FullNameInput';

describe('FullNameInput component', () => {
  test('renders input field correctly', () => {
    // Define mock props
    const edit = false;
    const index = 0;
    const handleInputChange = jest.fn();
    const formData = ['John Doe']; // Sample form data
    const submittedFormData = 'John Doe'; // Sample submitted form data
    const action = false;

    // Render the component
    const { getByPlaceholderText } = render(
      <FullNameInput
        edit={edit}
        index={index}
        handleInputChange={handleInputChange}
        formData={formData}
        submittedFormData={submittedFormData}
        action={action}
      />
    );

    // Assert that the input field is rendered
    // eslint-disable-next-line testing-library/prefer-screen-queries
    const inputElement = getByPlaceholderText(''); // Adjust the placeholder text as needed
    expect(inputElement).toBeInTheDocument();

    // Simulate user input by changing the value
    fireEvent.change(inputElement, { target: { value: 'Jane Doe' } });

    // Assert that the handleFullNameChange function is called with the correct parameters
    expect(handleInputChange).toHaveBeenCalledWith(0, 'Jane Doe');
  });

  test('renders submitted form data when action is true', () => {
    // Define mock props with action set to true
    const edit = false;
    const index = 0;
    const handleInputChange = jest.fn();
    const formData = ['John Doe']; // Sample form data
    const submittedFormData = 'John Doe'; // Sample submitted form data
    const action = true;

    // Render the component
    const { getByText } = render(
      <FullNameInput
        edit={edit}
        index={index}
        handleInputChange={handleInputChange}
        formData={formData}
        submittedFormData={submittedFormData}
        action={action}
      />
    );

    // Assert that the submitted form data is rendered
    // eslint-disable-next-line testing-library/prefer-screen-queries
    const submittedDataElement = getByText('John Doe');
    expect(submittedDataElement).toBeInTheDocument();
  });
});
