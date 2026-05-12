const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// ====== DATA ======
const menuItems = [
  { id: 1, name: "Burger", price: 50, emoji: "🍔" },
  { id: 2, name: "Pizza", price: 80, emoji: "🍕" },
  { id: 3, name: "Pasta", price: 60, emoji: "🍝" },
  { id: 4, name: "Salad", price: 40, emoji: "🥗" },
  { id: 5, name: "Fries", price: 30, emoji: "🍟" },
];

const orders = [];

// ====== ROUTES ======

// GET - عرض المنيو
app.get("/api/menu", (req, res) => {
  res.json(menuItems);
});

// POST - إضافة أوردر جديد
app.post("/api/orders", (req, res) => {
  const { items, total } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: "No items in order" });
  }

  const newOrder = {
    id: orders.length + 1,
    items,
    total,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };

  orders.push(newOrder);
  res.status(201).json(newOrder);
});

// GET - عرض كل الأوردرات
app.get("/api/orders", (req, res) => {
  res.json(orders);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});