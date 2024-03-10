import React from 'react';
import { render } from '@testing-library/react';
import FavouriteForms from '../components/FavouriteForms';
import { BrowserRouter as Router } from 'react-router-dom';

describe('FavouriteForm', () => {
  it('renders correctly with provided favourite', () => {
    const favourite = {
      fav: 'TestForm'
    };

    const { queryByText } = render(
      <Router>
        <FavouriteForms fav={favourite.fav} />
      </Router>
    );

    // eslint-disable-next-line testing-library/prefer-screen-queries
    const cardTitle = queryByText((content, element) => {
      return element.tagName.toLowerCase() === 'h3' && content.includes(favourite.fav);
    });
    
    let link;
    try {
      // eslint-disable-next-line testing-library/prefer-screen-queries
      link = queryByText((content, element) => {
        return element.tagName.toLowerCase() === 'a' && content.includes(`Click here to fill out the ${favourite.fav} Form:`);
      });
    } catch (error) {
      throw new Error('Link not found');
    }

    // Check if card title and link are rendered correctly with the provided favourite
    expect(cardTitle).toBeTruthy();
    expect(() => { if (!link) throw new Error('Link not found') }).toThrow('Link not found');
  });
});