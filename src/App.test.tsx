import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders project title on main page', () => {
  render(<App />);
  const linkElement = screen.getByText(/Firestore query examples/i);
  expect(linkElement).toBeInTheDocument();
});
