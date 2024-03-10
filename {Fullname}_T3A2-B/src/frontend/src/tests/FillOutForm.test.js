import React from 'react';
import { render, fireEvent} from '@testing-library/react';
import FillOutForm from '../components/FillOutForm';
import {  FormTemplateProvider, FormTemplateContext } from '../contexts/FormTemplateProvider';

// Mock ApiProvider module
jest.mock('../contexts/ApiProvider', () => {
    const React = require('react');
    return {
      ApiContext: React.createContext({ apiUrl: 'mock-api-url' }),
    };
  });

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

  // Mock console.error
  console.error = jest.fn();
  
  describe('FillOutForm component', () => {
    it('renders without crashing', () => {
        render(
            <FormTemplateProvider>
                <FillOutForm />
            </FormTemplateProvider>
        );
    });
  
    it('submits form successfully', async () => {
      const mockFormName = 'Mock Form';
      const mockFormDescription = 'Mock Form Description';
      const mockSetCreatingForm = jest.fn();
      const mockSetFormDescription = jest.fn();
      const mockRenderedFormComponents = [];
      const mockPreview = false;
      const mockFetchUserForms = jest.fn();

      const mockContextValue = {
          formComponents: {},
          fetchFormTemplate: jest.fn(),
          formTemplate: {},
          setFormTemplate: jest.fn(),
      };

      const { getByText } = render(
          <FormTemplateContext.Provider value={mockContextValue}>
              <FormTemplateProvider>
                  <FillOutForm
                      formName={mockFormName}
                      formDescription={mockFormDescription}
                      setCreatingForm={mockSetCreatingForm}
                      setFormDescription={mockSetFormDescription}
                      renderedFormComponents={mockRenderedFormComponents}
                      preview={mockPreview}
                      fetchUserForms={mockFetchUserForms}
                  />
              </FormTemplateProvider>
          </FormTemplateContext.Provider>
      );

      // eslint-disable-next-line testing-library/prefer-screen-queries
      const submitButton = getByText('Submit');
      fireEvent.click(submitButton);

  });
});