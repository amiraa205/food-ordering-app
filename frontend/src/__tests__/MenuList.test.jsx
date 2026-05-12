import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('axios', () => ({
  default: { get: vi.fn() },
}));

import axios from 'axios';
import MenuList from '../components/MenuList';

const mockMenu = [
  { id: 1, name: 'Burger', price: 50, emoji: '🍔' },
  { id: 2, name: 'Pizza', price: 80, emoji: '🍕' },
];

test('shows loading state initially', () => {
  axios.get.mockReturnValue(new Promise(() => {}));
  render(<MenuList addToCart={() => {}} />);
  expect(screen.getByText(/loading menu/i)).toBeInTheDocument();
});

test('shows menu items after loading', async () => {
  axios.get.mockResolvedValue({ data: mockMenu });
  render(<MenuList addToCart={() => {}} />);
  expect(await screen.findByText(/burger/i)).toBeInTheDocument();
  expect(await screen.findByText(/pizza/i)).toBeInTheDocument();
});

test('shows error message when API fails', async () => {
  axios.get.mockRejectedValue(new Error('Network Error'));
  render(<MenuList addToCart={() => {}} />);
  expect(await screen.findByText(/failed to load menu/i)).toBeInTheDocument();
});