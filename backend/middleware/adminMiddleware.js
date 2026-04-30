const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protectAdmin = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
            req.admin = await Admin.findById(decoded.id).select('-passwordHash');
            if (!req.admin) {
                return res.status(401).json({ message: 'Not authorized, admin not found' });
            }
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized as admin, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized as admin, no token' });
    }
};

module.exports = { protectAdmin };
