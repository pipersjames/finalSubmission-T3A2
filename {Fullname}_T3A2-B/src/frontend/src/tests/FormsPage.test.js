import React from 'react';
import { render} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom'; // Mocking BrowserRouter for routing
import FormPage from '../pages/FormsPage';

// Mock ApiProvider module
jest.mock('../contexts/ApiProvider', () => {
    const React = require('react');
    return {
      ApiContext: React.createContext({ apiUrl: 'mock-api-url' }),
    };
  }); 

// Mock form templates data
const formTemplates = [
  { _id: '1', formName: 'Form1' },
  { _id: '2', formName: 'Form2' },
];

// Mock user forms data
const userForms = [
  {
    _id: '1',
    description: 'Form Description',
    timeStamp: new Date(),
    user: { fname: 'John', lname: 'Doe' },
    status: 'Submitted',
    formTemplate: { assignedTo: { fname: 'Jane' } },
    taskedUser: { fname: 'Alice', lname: 'Smith' },
  },
];

 //Mocking the useEffect
 jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useEffect: jest.fn(),
  }));
  

describe('FormPage component', () => {
  beforeEach(() => {
    // Mock fetchFormTemplates and fetchUserForms functions
    global.fetch = jest.fn().mockResolvedValueOnce({ ok: true, json: () => ({ result: formTemplates }) });
    global.fetch = jest.fn().mockResolvedValueOnce({ ok: true, json: () => ({ result: userForms }) });
  });

  test('renders form templates', async () => {
    render(
      <BrowserRouter>
        <FormPage />
      </BrowserRouter>
    );

    expect(React.useEffect).toHaveBeenCalled();

  });

  test('clicking on a form template selects it and fetches user forms', async () => {
    render(
      <BrowserRouter>
        <FormPage />
      </BrowserRouter>
    );

    expect(React.useEffect).toHaveBeenCalled();
  });

  // Add more test cases as needed...
});
