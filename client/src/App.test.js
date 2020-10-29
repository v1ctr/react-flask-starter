import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from "react-router-dom";
import App from './App';

test('renders signin', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByText(/sign in/i)).toBeInTheDocument();
});