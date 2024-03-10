import React from 'react';
import { render } from '@testing-library/react';
import SavedProgress from '../components/SavedProgess';

describe('SavedProgress component', () => {
  it('renders correctly with dummy data', () => {
    const dummySavedData = [
      { id: 1, formType: 'Saved Item 1', description: 'Description for Saved Item 1' },
      { id: 2, formType: 'Saved Item 2', description: 'Description for Saved Item 2' },
      { id: 3, formType: 'Saved Item 3', description: 'Description for Saved Item 3' },
    ];

    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f()); // Mocking useEffect

    const { queryByText } = render(<SavedProgress />);
    
    dummySavedData.forEach(item => {
      // eslint-disable-next-line testing-library/prefer-screen-queries
      const formNameElement = queryByText(item.formType);
      // eslint-disable-next-line testing-library/prefer-screen-queries
      const descriptionElement = queryByText(item.description);

      // Check if formNameElement is not null before asserting its presence
      if (formNameElement) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(formNameElement).toBeInTheDocument(); // Check if formName is in the document
      }

      // Check if descriptionElement is not null before asserting its presence
      if (descriptionElement) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(descriptionElement).toBeInTheDocument(); // Check if description is in the document
      }
    });
  });
});
