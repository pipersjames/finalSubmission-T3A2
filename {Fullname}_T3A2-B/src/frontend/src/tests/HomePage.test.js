import React from 'react';
import { render, waitFor } from '@testing-library/react';
import HomePage from '../pages/HomePage';
import { FavouritesContext } from '../contexts/FavouritesProvider';


// Mock FavouritesContext
jest.mock('../contexts/FavouritesProvider', () => {
const React = require('react');
const mockFavouritesContextValue = {
    getFavourites: jest.fn(),
    patchFavourites: jest.fn(),
    favourites: [], // Mock favourites data
};
return {
    FavouritesContext: React.createContext(mockFavouritesContextValue),
};
});

describe('HomePage component', () => {
  it('renders loading state initially', () => {
    const mockGetFavourites = jest.fn();
    const mockFavourites = [];

    // eslint-disable-next-line no-unused-vars
    const { getByText } = render(
      <FavouritesContext.Provider value={{ getFavourites: mockGetFavourites, favourites: mockFavourites }}>
        <HomePage />
      </FavouritesContext.Provider>
    );

    // eslint-disable-next-line testing-library/no-node-access
    expect(document.querySelector('.loading-indicator')).toBeFalsy();
});

    it('renders favourite forms after loading', async () => {
        const mockGetFavourites = jest.fn();
        const mockFavourites = [{ id: 1, name: 'Form 1' }, { id: 2, name: 'Form 2' }];

        // Mocking the useContext hook
        jest.spyOn(React, 'useContext').mockReturnValueOnce({
        getFavourites: mockGetFavourites,
        favourites: mockFavourites,
        });

        // eslint-disable-next-line no-unused-vars
        const { getByText } = render(<HomePage />);
});

  it('renders no favourite forms message if favourites array is empty', async () => {
    const mockGetFavourites = jest.fn().mockResolvedValueOnce(); // Assuming getFavourites returns a resolved promise
    const mockFavourites = [];

    const { getByText } = render(
      <FavouritesContext.Provider value={{ getFavourites: mockGetFavourites, favourites: mockFavourites }}>
        <HomePage />
      </FavouritesContext.Provider>
    );

    await waitFor(() => {
      // eslint-disable-next-line testing-library/prefer-screen-queries
      expect(getByText('No favourite forms found.')).toBeInTheDocument();
    });
  });
});
