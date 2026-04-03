const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());

// Helper function to read the database
const readDB = () => {
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
};

// Helper function to write to the database
const writeDB = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// --- API ROUTES ---

// 1. GET Products
app.get('/api/products', (req, res) => {
    try {
        const db = readDB();
        res.json(db.products);
    } catch (error) {
        res.status(500).json({ message: "Error reading products" });
    }
});

// 2. POST Order (Mock Checkout)
app.post('/api/checkout', (req, res) => {
    try {
        const db = readDB();
        const newOrder = {
            id: Date.now(), // simple unique ID
            ...req.body,
            createdAt: new Date().toISOString()
        };
        
        db.orders.push(newOrder);
        writeDB(db);
        
        res.status(201).json({ message: "Order placed successfully", orderId: newOrder.id });
    } catch (error) {
        res.status(500).json({ message: "Error processing order" });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Virox JSON Backend running on http://localhost:${PORT}`);
});
