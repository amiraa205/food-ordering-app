import { API_URL } from '../config';
import { useState, useEffect } from 'react';
import axios from 'axios';

function MenuList({ addToCart }) {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/menu`)
      .then((res) => {
        setMenu(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load menu!');
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{ textAlign: 'center' }}>Loading menu... ⏳</p>;
  if (error)
    return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {menu.map((item) => (
        <div
          key={item.id}
          style={{
            background: '#fff',
            padding: '16px',
            borderRadius: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
          }}
        >
          <div>
            <p style={{ fontSize: '20px' }}>
              {item.emoji} {item.name}
            </p>
            <p style={{ color: '#ff6b35', fontWeight: 'bold' }}>
              {item.price} EGP
            </p>
          </div>
          <button
            onClick={() => addToCart(item)}
            style={{
              background: '#ff6b35',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '16px',
            }}
          >
            + Add
          </button>
        </div>
      ))}
    </div>
  );
}

export default MenuList;
