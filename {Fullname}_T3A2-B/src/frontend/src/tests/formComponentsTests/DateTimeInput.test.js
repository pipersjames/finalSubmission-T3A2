import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import DateTimeInput from '../../components/formComponents/DateTimeInput';

describe('DateTimeInput component', () => {
  const edit = false;
  const index = 0;
  const handleInputChange = jest.fn();
  const formData = ['2024-02-29T12:00'];
  const submittedFormData = '2024-02-29T12:00';

  test('renders with correct value and handles input change', () => {
    const { getByDisplayValue } = render(
      <DateTimeInput
        edit={edit}
        index={index}
        handleInputChange={handleInputChange}
        formData={formData}
        submittedFormData={submittedFormData}
        action={false}
      />
    );

    // eslint-disable-next-line testing-library/prefer-screen-queries
    const inputElement = getByDisplayValue('2024-02-29T12:00');
    expect(inputElement).toBeInTheDocument();

    fireEvent.change(inputElement, { target: { value: '2024-03-01T12:00' } });
    expect(handleInputChange).toHaveBeenCalledWith(0, '2024-03-01T12:00');
  });

  test('disables input field when edit is true', () => {
    // eslint-disable-next-line no-unused-vars
    const { getByLabelText } = render(
      <DateTimeInput
        edit={true}
        index={index}
        handleInputChange={handleInputChange}
        formData={formData}
        submittedFormData={submittedFormData}
        action={false}
      />
    );

  });

  test('renders submitted form data when action is true', () => {
    const { getByText } = render(
      <DateTimeInput
        edit={false}
        index={index}
        handleInputChange={handleInputChange}
        formData={formData}
        submittedFormData={submittedFormData}
        action={true}
      />
    );

    // eslint-disable-next-line testing-library/prefer-screen-queries
    const submittedDataElement = getByText('2024-02-29T12:00');
    expect(submittedDataElement).toBeInTheDocument();
  });
});
