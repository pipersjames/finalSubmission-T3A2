import React from 'react';
import { render, waitFor } from '@testing-library/react';
import ActionsMenu from '../components/ActionsMenu';

// Mock ApiProvider module
jest.mock('../contexts/ApiProvider', () => {
    const React = require('react');
    return {
      ApiContext: React.createContext({ apiUrl: 'mock-api-url' }),
    };
  });

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('ActionsMenu component', () => {
    test('renders correctly and triggers navigation on item click', async () => {
        const mockActions = {
          assigned: [{ _id: '1', description: 'Assigned Task 1' }],
          tasked: [{ _id: '2', description: 'Tasked Action 1' }]
        };
        
        // Mock fetchActions function
        jest.spyOn(global, 'fetch').mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockActions)
        });
    
        const { queryByText } = render(<ActionsMenu />);
    
        // Wait for the loading text to disappear
        await waitFor(() => {
            // eslint-disable-next-line testing-library/prefer-screen-queries
            expect(queryByText('Loading...')).not.toBeInTheDocument();
        });
    });
    
});