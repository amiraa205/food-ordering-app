import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('axios', () => ({
  default: { get: vi.fn() },
}));

import axios from 'axios';
import Orders from '../components/Orders';

test('shows no orders message when empty', async () => {
  axios.get.mockResolvedValue({ data: [] });
  render(<Orders />);
  expect(await screen.findByText(/no orders yet/i)).toBeInTheDocument();
});

test('matches snapshot when empty', async () => {
  axios.get.mockResolvedValue({ data: [] });
  const { container } = render(<Orders />);
  await screen.findByText(/no orders yet/i);
  expect(container).toMatchSnapshot();
});
