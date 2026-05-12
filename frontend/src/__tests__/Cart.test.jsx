import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Cart from '../components/Cart';

test('shows empty cart message when cart is empty', () => {
  render(<Cart cart={[]} setCart={() => {}} setActiveTab={() => {}} />);
  expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
});

test('shows item and total when cart has items', () => {
  const cart = [{ id: 1, name: 'Burger', price: 50, emoji: '🍔', quantity: 2 }];
  render(<Cart cart={cart} setCart={() => {}} setActiveTab={() => {}} />);
  expect(screen.getByText(/burger/i)).toBeInTheDocument();
  expect(screen.getAllByText(/100 EGP/i).length).toBeGreaterThan(0);

});

test('renders place order button', () => {
  const cart = [{ id: 1, name: 'Burger', price: 50, emoji: '🍔', quantity: 1 }];
  render(<Cart cart={cart} setCart={() => {}} setActiveTab={() => {}} />);
  expect(screen.getByText(/place order/i)).toBeInTheDocument();
});