import React from 'react';
import { render} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import CreateAccountPage from '../pages/CreateAccountPage';
import { ApiContext } from '../contexts/ApiProvider';

// Mock the useNavigate hook
const mockNavigate = jest.fn();

// Mock the react-router-dom package
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('CreateAccountPage component', () => {
  test("CreateAccountPage component renders without crashing", () => {
    // Mock context value
    const mockContextValue = {
      apiUrl: 'mock-api-url',
    };

    // Render the component inside MemoryRouter
    render(
      <MemoryRouter>
        <ApiContext.Provider value={mockContextValue}>
          <CreateAccountPage />
        </ApiContext.Provider>
      </MemoryRouter>
    );
  });
  
});
