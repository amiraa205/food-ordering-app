import { useState, useEffect } from "react";
import axios from "axios";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/orders`)
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading orders... ⏳</p>;
  if (orders.length === 0)
    return <p style={{ textAlign: "center" }}>No orders yet 📋</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            background: "#fff",
            padding: "16px",
            borderRadius: "10px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          }}
        >
          <p style={{ fontWeight: "bold", marginBottom: "8px" }}>
            Order #{order.id} —{" "}
            <span style={{ color: "green" }}>{order.status}</span>
          </p>
          {order.items.map((item) => (
            <p key={item.id} style={{ marginBottom: "4px" }}>
              {item.emoji} {item.name} × {item.quantity}
            </p>
          ))}
          <p style={{ fontWeight: "bold", marginTop: "8px", color: "#ff6b35" }}>
            Total: {order.total} EGP
          </p>
        </div>
      ))}
    </div>
  );
}

export default Orders;