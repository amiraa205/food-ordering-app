import { useState } from 'react';
import MenuList from './components/MenuList';
import Cart from './components/Cart';
import Orders from './components/Orders';
import './index.css';

function App() {
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState('menu');

  const addToCart = (item) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>
        🍔 Food Ordering App
      </h1>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('menu')}
          style={{
            flex: 1,
            padding: '10px',
            background: activeTab === 'menu' ? '#ff6b35' : '#fff',
            color: activeTab === 'menu' ? '#fff' : '#333',
            border: '1px solid #ff6b35',
            borderRadius: '8px',
          }}
        >
          Menu
        </button>
        <button
          onClick={() => setActiveTab('cart')}
          style={{
            flex: 1,
            padding: '10px',
            background: activeTab === 'cart' ? '#ff6b35' : '#fff',
            color: activeTab === 'cart' ? '#fff' : '#333',
            border: '1px solid #ff6b35',
            borderRadius: '8px',
          }}
        >
          Cart 🛒 {cartCount > 0 && `(${cartCount})`}
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          style={{
            flex: 1,
            padding: '10px',
            background: activeTab === 'orders' ? '#ff6b35' : '#fff',
            color: activeTab === 'orders' ? '#fff' : '#333',
            border: '1px solid #ff6b35',
            borderRadius: '8px',
          }}
        >
          Orders 📋
        </button>
      </div>

      {/* Content */}
      {activeTab === 'menu' && <MenuList addToCart={addToCart} />}
      {activeTab === 'cart' && (
        <Cart cart={cart} setCart={setCart} setActiveTab={setActiveTab} />
      )}
      {activeTab === 'orders' && <Orders />}
    </div>
  );
}

export default App;
