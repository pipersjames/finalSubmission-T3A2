import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import EmailInput from '../../components/formComponents/EmailInput';

describe('EmailInput component', () => {
  test('renders with correct value and handles input change', () => {
    // Define mock props
    const edit = false;
    const index = 0;
    const handleInputChange = jest.fn();
    const formData = ['test@example.com']; // Sample form data
    const submittedFormData = 'test@example.com'; // Sample submitted form data
    const action = false;

    // Render the component
    // eslint-disable-next-line no-unused-vars
    const { getByLabelText, getByDisplayValue } = render(
      <EmailInput
        edit={edit}
        index={index}
        handleInputChange={handleInputChange}
        formData={formData}
        submittedFormData={submittedFormData}
        action={action}
      />
    );

    // Assert that the input field is rendered with the correct value
    // eslint-disable-next-line testing-library/prefer-screen-queries
    const inputElement = getByDisplayValue('test@example.com');

    // Assert that the value is correctly derived from the formData prop
    expect(inputElement).toBeInTheDocument();

    // Simulate user input by changing the value
    fireEvent.change(inputElement, { target: { value: 'newemail@example.com' } });

    // Assert that the handleEmailChange function is called with the correct parameters
    expect(handleInputChange).toHaveBeenCalledWith(0, 'newemail@example.com');
  });

  test('disables input field when edit is true', () => {
    // Define mock props with edit set to true
    const edit = true;
    const index = 0;
    const handleInputChange = jest.fn();
    const formData = ['test@example.com']; // Sample form data
    const submittedFormData = 'test@example.com'; // Sample submitted form data
    const action = false;

    // Render the component
    const { getByLabelText } = render(
      <EmailInput
        edit={edit}
        index={index}
        handleInputChange={handleInputChange}
        formData={formData}
        submittedFormData={submittedFormData}
        action={action}
      />
    );

    // Assert that the input field is disabled
    // eslint-disable-next-line testing-library/prefer-screen-queries
    const inputElement = getByLabelText('Email:');
    expect(inputElement).toHaveAttribute('disabled');
  });

  test('renders submitted form data when action is true', () => {
    // Define mock props with action set to true
    const edit = false;
    const index = 0;
    const handleInputChange = jest.fn();
    const formData = ['test@example.com']; // Sample form data
    const submittedFormData = 'submitted@example.com'; // Sample submitted form data
    const action = true;

    // Render the component
    const { getByText } = render(
      <EmailInput
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
    const submittedDataElement = getByText('submitted@example.com');
    expect(submittedDataElement).toBeInTheDocument();
  });

  // Add more tests as needed to cover other use cases and edge cases
});
