const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Mock bypass for demo accounts
            const demoUsers = {
                '6634d0000000000000000001': { _id: '6634d0000000000000000001', name: 'Test User', email: 'test@example.com', role: 'admin' },
                '6634d0000000000000000002': { _id: '6634d0000000000000000002', name: 'Admin User', email: 'admin@demo.com', role: 'admin' },
                '6634d0000000000000000003': { _id: '6634d0000000000000000003', name: 'Jane Doe', email: 'jane@demo.com', role: 'member' }
            };

            if (demoUsers[decoded.id]) {
                req.user = demoUsers[decoded.id];
            } else {
                req.user = await User.findById(decoded.id).select('-password');
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };
