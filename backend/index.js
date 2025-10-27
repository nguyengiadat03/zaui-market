const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const API_PREFIX = '/api/v1';

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON request bodies

// --- Mock Database (In-memory for demonstration) ---
// In a real application, you would connect to a database (PostgreSQL/MySQL) here.
const mockDB = {
    categories: [
        { id: 1, name: "Thức Uống", imageUrl: "https://example.com/drink.png" },
        { id: 2, name: "Đồ Ăn Nhanh", imageUrl: "https://example.com/fastfood.png" },
    ],
    products: [
        { id: 101, categoryId: 1, name: "Cà Phê Đen", price: 25000, imageUrl: "https://example.com/cf.png", stock: 50 },
        { id: 102, categoryId: 1, name: "Trà Sữa Trân Châu", price: 35000, imageUrl: "https://example.com/ts.png", stock: 30 },
        { id: 201, categoryId: 2, name: "Bánh Mì Kẹp", price: 40000, imageUrl: "https://example.com/bm.png", stock: 20 },
    ],
    banners: [
        { id: 1, imageUrl: "https://example.com/banner1.png", link: "/product/101" },
        { id: 2, imageUrl: "https://example.com/banner2.png", link: "/categories" },
    ],
    orders: [], // Store orders temporarily
    users: [], // Store users temporarily
};

// --- Helper function for Zalo Auth Mock ---
const verifyZaloToken = (token) => {
    // In a real app, this would be an API call to Zalo's server
    // to verify the token and get the user's Zalo ID.
    if (token) {
        return {
            zaloUserId: 'zalo_user_12345',
            name: 'Người Dùng Zalo',
            avatar: 'https://example.com/avatar.png'
        };
    }
    return null;
};

// --- API Endpoints ---

// 1. Get Categories
app.get(`${API_PREFIX}/categories`, (req, res) => {
    res.json(mockDB.categories);
});

// 2. Get Products (with optional filtering)
app.get(`${API_PREFIX}/products`, (req, res) => {
    const { categoryId, q } = req.query;
    let filteredProducts = mockDB.products;

    if (categoryId) {
        filteredProducts = filteredProducts.filter(p => p.categoryId === parseInt(categoryId));
    }

    if (q) {
        const query = q.toLowerCase();
        filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(query));
    }

    res.json(filteredProducts);
});

// 3. Get Banners
app.get(`${API_PREFIX}/banners`, (req, res) => {
    res.json(mockDB.banners);
});

// 4. Get Orders for a User (Requires Authentication)
app.get(`${API_PREFIX}/orders`, (req, res) => {
    const authHeader = req.headers.authorization;
    const zaloToken = authHeader ? authHeader.split(' ')[1] : null;

    const user = verifyZaloToken(zaloToken);

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // In a real app, filter by user.zaloUserId
    const userOrders = mockDB.orders.filter(o => o.userId === user.zaloUserId); 
    res.json(userOrders);
});

// 5. Create Order (Requires Authentication)
app.post(`${API_PREFIX}/orders`, (req, res) => {
    const authHeader = req.headers.authorization;
    const zaloToken = authHeader ? authHeader.split(' ')[1] : null;
    const user = verifyZaloToken(zaloToken);

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { items, address, stationId, payment } = req.body;

    if (!items || !address || !payment) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const newOrder = {
        id: mockDB.orders.length + 1,
        userId: user.zaloUserId,
        items,
        address,
        stationId,
        payment,
        status: 'Pending',
        total: items.reduce((sum, item) => sum + item.qty * item.price, 0),
        createdAt: new Date().toISOString(),
    };

    mockDB.orders.push(newOrder);
    res.status(201).json({ message: 'Order created successfully', order: newOrder });
});

// 6. User Profile (Mock for demonstration)
// In a real app, the token is verified and user data is returned.
app.get(`${API_PREFIX}/user/profile`, (req, res) => {
    const authHeader = req.headers.authorization;
    const zaloToken = authHeader ? authHeader.split(' ')[1] : null;
    const user = verifyZaloToken(zaloToken);

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    res.json(user);
});

// --- Server Start ---
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(\`API URL: http://localhost:\${PORT}\${API_PREFIX}\`);
});
