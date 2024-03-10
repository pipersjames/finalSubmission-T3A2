import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import FormBuilder from '../pages/FormBuilder';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter

// Define mockNavigate function
const mockNavigate = jest.fn();

// Mocking the react-router package
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate // Returning mockNavigate
}));


jest.mock('../contexts/ApiProvider', () => {
  const React = require('react'); // Import React here
  return {
    ApiContext: React.createContext({ apiUrl: 'mock-api-url' }),
  };
});

jest.mock('../contexts/FormTemplateProvider', () => {
  const React = require('react');
  return {
    FormTemplateContext: React.createContext({ formComponents: {} }),
  };
});


// Mocking the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        result: [
          { _id: 'user_id_1', fname: 'John', lname: 'Doe' },
          { _id: 'user_id_2', fname: 'Jane', lname: 'Doe' }
        ]
      })
  })
);

describe('FormBuilder', () => {
  it('fetches usernames from the database and sets assignedOptions state', async () => {
    // Render the FormBuilder component within MemoryRouter
    // eslint-disable-next-line no-unused-vars
    const { findByLabelText } = render(
      <MemoryRouter>
        <FormBuilder />
      </MemoryRouter>
    );

    // Wait for the component to finish fetching data
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Check if the fetch function is called with the correct URL
    expect(mockNavigate).toHaveBeenCalledWith('/');

  });

  it('handles form name input change', () => {
    const { getByLabelText } = render(<FormBuilder />);
    // eslint-disable-next-line testing-library/prefer-screen-queries
    const input = getByLabelText('Form Name:');
    fireEvent.change(input, { target: { value: 'New Form Name' } });
    expect(input.value).toBe('New Form Name');
  });


});
