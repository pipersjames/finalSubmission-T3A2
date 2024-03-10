import React from 'react';
import { render, act } from '@testing-library/react';
import { FavouritesProvider, FavouritesContext } from '../../contexts/FavouritesProvider'; // Import FavouritesContext

// Mock ApiProvider module
jest.mock('../../contexts/ApiProvider', () => {
  const React = require('react'); // Import React here
  return {
    ApiContext: React.createContext({ apiUrl: 'mock-api-url' }),
  };
});

// Mock fetch function
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve([{ id: 1, name: 'Favourite 1' }]), // Mock response data
});

// Mock console.error
console.error = jest.fn();


describe('FavouritesProvider', () => {
  it('calls patchFavourites correctly', async () => {
    const jwt = 'mock-jwt';
    const favouritesData = [{ id: 1, name: 'Favourite 1' }];

    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      render(
        <FavouritesProvider>
          <FavouritesContext.Consumer>
            {({ patchFavourites }) => {
              patchFavourites(favouritesData, jwt);
            }}
          </FavouritesContext.Consumer>
        </FavouritesProvider>
      );
    });

    expect(fetch).toHaveBeenCalledWith('mock-api-url/users/favourites', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'jwt': jwt,
      },
      body: JSON.stringify({ favourite: favouritesData }),
    });
  });
});


it('calls getFavourites correctly', async () => {
  const jwt = 'mock-jwt';
  const mockResponse = [{ id: 1, name: 'Favourite 1' }];
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockResponse),
  });

  let result;

  // eslint-disable-next-line testing-library/no-unnecessary-act
  await act(async () => {
    render(
      <FavouritesProvider>
        <FavouritesContext.Consumer>
          {({ getFavourites }) => {
            result = getFavourites(jwt); // Removed await here
          }}
        </FavouritesContext.Consumer>
      </FavouritesProvider>
    );

    result = await result; // Moved await here
  });

  expect(fetch).toHaveBeenCalledWith('mock-api-url/users/favourites', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'jwt': jwt,
    },
  });

  // Assert the result
  expect(result).toBeTruthy();

});