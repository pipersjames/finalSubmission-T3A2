import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SelectionTable from '../components/FormBuilderSelections';

describe('SelectionTable component', () => {
  it('renders items correctly', () => {
    const items = ['Item 1', 'Item 2', 'Item 3'];
    const onItemClick = jest.fn(); // Mock function for onItemClick

    const { getByText } = render(<SelectionTable items={items} onItemClick={onItemClick} />);

    // Check if each item is rendered
    items.forEach(item => {
      // eslint-disable-next-line testing-library/prefer-screen-queries
      const itemElement = getByText(item);
      expect(itemElement).toBeInTheDocument();
    });
  });

  it('calls onItemClick handler when an item is clicked', () => {
    const items = ['Item 1', 'Item 2', 'Item 3'];
    const onItemClick = jest.fn(); // Mock function for onItemClick

    const { getByText } = render(<SelectionTable items={items} onItemClick={onItemClick} />);

    // Click on the first item
    // eslint-disable-next-line testing-library/prefer-screen-queries
    fireEvent.click(getByText(items[0]));

    // Check if onItemClick is called with the correct item
    expect(onItemClick).toHaveBeenCalledWith(items[0]);
  });
});
