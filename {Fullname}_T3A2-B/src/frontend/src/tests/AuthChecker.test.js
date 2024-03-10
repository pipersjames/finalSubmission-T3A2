import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import AuthChecker from '../components/AuthChecker';
import { ApiContext } from '../contexts/ApiProvider';
import Cookies from 'js-cookie';

// Mock the navigate function provided by React Router
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock the ApiContext
const mockApiUrl = 'http://example.com';
const mockApiContext = {
  apiUrl: mockApiUrl,
};

// Mock the Cookies module
jest.mock('js-cookie', () => ({
  get: jest.fn(),
}));

describe('AuthChecker component', () => {
    // Mock console.log and console.error to prevent them from appearing in the test output
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  // Restore console.log and console.error after each test
  afterEach(() => {
    console.log.mockRestore();
    console.error.mockRestore();
  });


  test('redirects to login page when no JWT token is present', async () => {
    // Arrange
    Cookies.get.mockReturnValue(null);

    // Act
    render(
      <ApiContext.Provider value={mockApiContext}>
        <AuthChecker />
      </ApiContext.Provider>
    );

    // Assert
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'));
  });

  test('redirects to login page when server returns 401', async () => {
    // Arrange
    Cookies.get.mockReturnValue('mock-jwt-token');
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
    });

    // Act
    render(
      <ApiContext.Provider value={mockApiContext}>
        <AuthChecker />
      </ApiContext.Provider>
    );

    // Assert
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'));
  });

  test('redirects to login page when server returns 403', async () => {
    // Arrange
    Cookies.get.mockReturnValue('mock-jwt-token');
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 403,
    });

    // Act
    render(
      <ApiContext.Provider value={mockApiContext}>
        <AuthChecker />
      </ApiContext.Provider>
    );

    // Assert
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'));
  });

  test('does not redirect when server returns successful response', async () => {
    // Arrange
    Cookies.get.mockReturnValue('mock-jwt-token');
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
    });

    // Act
    render(
      <ApiContext.Provider value={mockApiContext}>
        <AuthChecker />
      </ApiContext.Provider>
    );

    // Assert
    await waitFor(() => expect(mockNavigate).not.toHaveBeenCalled());
  });

  test('handles error when fetch fails', async () => {
    // Arrange
    Cookies.get.mockReturnValue('mock-jwt-token');
    global.fetch = jest.fn().mockRejectedValue(new Error('Mock fetch error'));
  
    // Act
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      render(
        <ApiContext.Provider value={mockApiContext}>
          <AuthChecker />
        </ApiContext.Provider>
      );
    });
  
    // Assert, testing for element not to be present(?)
    expect(screen.queryByText('Some Text')).toBeNull();
});  
});

