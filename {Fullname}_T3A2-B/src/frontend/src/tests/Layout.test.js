import React from 'react';
import { render } from '@testing-library/react';
import Layout from '../components/Layout';

describe('Layout component', () => {
    test('renders children inside a responsive container', () => {
      // Define children components
      const ChildComponent = () => <div>Child Component</div>;
  
      // Render the Layout component with the ChildComponent as its children
      const { getByText, getByTestId } = render(
        <Layout>
          <ChildComponent />
        </Layout>
      );
  
      // Assert that the child component is rendered
      // eslint-disable-next-line testing-library/prefer-screen-queries
      expect(getByText('Child Component')).toBeInTheDocument();
  
      // Assert that the container has the class "container-fluid" from react-bootstrap
      // eslint-disable-next-line testing-library/prefer-screen-queries
      const container = getByTestId('layout-container'); // Get the container by test id
      expect(container).toHaveClass('container-fluid');
    });
  });
