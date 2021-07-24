import { render, screen } from '@testing-library/react';
import App from './App';

test('launches app', () => {
  render(<App />);
  const linkElement = screen.getByText(/Rock Paper Scissors/i);
  expect(linkElement).toBeInTheDocument();
});
