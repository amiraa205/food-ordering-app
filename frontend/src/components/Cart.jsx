import { API_URL } from '../config';
import axios from 'axios';

function Cart({ cart, setCart, setActiveTab }) {
  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const placeOrder = () => {
    if (cart.length === 0) return;

    axios.post(`${API_URL}/api/orders`, { items: cart, total })

      .then(() => {
        setCart([]);
        setActiveTab('orders');
      })
      .catch(() => alert('Something went wrong!'));
  };

  if (cart.length === 0)
    return <p style={{ textAlign: 'center' }}>Your cart is empty 🛒</p>;

  return (
    <div>
      {cart.map((item) => (
        <div
          key={item.id}
          style={{
            background: '#fff',
            padding: '14px',
            borderRadius: '10px',
            marginBottom: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
          }}
        >
          <p>
            {item.emoji} {item.name} × {item.quantity}
          </p>
          <p style={{ fontWeight: 'bold' }}>{item.price * item.quantity} EGP</p>
        </div>
      ))}

      <div
        style={{
          background: '#fff',
          padding: '14px',
          borderRadius: '10px',
          marginTop: '10px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
        }}
      >
        <p
          style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}
        >
          Total: {total} EGP
        </p>
        <button
          onClick={placeOrder}
          style={{
            width: '100%',
            padding: '12px',
            background: '#ff6b35',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
          }}
        >
          Place Order ✅
        </button>
      </div>
    </div>
  );
}

export default Cart;
