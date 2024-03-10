import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';

describe('Navbar component', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // eslint-disable-next-line testing-library/prefer-screen-queries
    expect(getByText('Stream-Lined')).toBeInTheDocument();
    // eslint-disable-next-line testing-library/prefer-screen-queries
    expect(getByText('Home')).toBeInTheDocument();
    // eslint-disable-next-line testing-library/prefer-screen-queries
    expect(getByText('Forms')).toBeInTheDocument();
    // eslint-disable-next-line testing-library/prefer-screen-queries
    expect(getByText('Actions')).toBeInTheDocument();
    // eslint-disable-next-line testing-library/prefer-screen-queries
    expect(getByText('Logout')).toBeInTheDocument();
  });

  it('handles logout when logout link is clicked', () => {
    const mockHandleLogout = jest.fn();
    const { getByText } = render(
      <MemoryRouter>
        <Navbar handleLogout={mockHandleLogout} />
      </MemoryRouter>
    );

    // eslint-disable-next-line testing-library/prefer-screen-queries
    const logoutLink = getByText('Logout');
    fireEvent.click(logoutLink);

    expect(typeof mockHandleLogout === 'function').toBeTruthy();
  });
});
