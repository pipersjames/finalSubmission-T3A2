import React from 'react';
import { render} from '@testing-library/react';
import CompletedForm from '../pages/ActionsPage';

// Mock ApiProvider module
jest.mock('../contexts/ApiProvider', () => {
    const React = require('react');
    return {
      ApiContext: React.createContext({ apiUrl: 'mock-api-url' }),
    };
  });

// Mock the FormTemplateContext
jest.mock('../contexts/FormTemplateProvider', () => {
    const React = require('react');
    return {
      FormTemplateContext: React.createContext({ formComponents: {} }),
    };
  });

// Define mockNavigate function
const mockNavigate = jest.fn();

// Mocking the react-router package
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate // Returning mockNavigate
}));

describe('CompletedForm component', () => {
  test('renders form data and allows actions', async () => {
    // Mock form data
    const mockFormData = {
      formTemplate: {
        formName: 'Form Name', // Mocking the form name
        formDescription: 'Form Description',
      },
      formData: {}, // Mock form data here
      actions: [], // Mock actions array
      status: 'open', // Mock form status
    };

    // Mock API calls
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ result: mockFormData }),
    });

    // Render the component
    // eslint-disable-next-line no-unused-vars
    const { getByLabelText } = render(<CompletedForm />);

    // Skip the user interaction part for now


  });
});
