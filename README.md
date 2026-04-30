# NovaMart — E-Commerce Store

A full-featured e-commerce application with customer storefront and separate admin panel.

## Quick Start

### 1. Start MongoDB
```bash
# Using MongoDB Compass or CLI
mongod
```
Database: `mongodb://localhost:27017/novamart`

### 2. Start Backend Server
```bash
cd backend
npm run start
# Server runs on http://localhost:5000
```

### 3. Access Applications

| App | URL |
|-----|-----|
| **Store** | http://localhost:5000 |
| **Admin Panel** | http://localhost:5000/admin |
| **API** | http://localhost:5000/api |

### 4. Default Credentials

**Customer:**
- Register new account at http://localhost:5000/auth.html

**Admin:**
- Email: `admin@novamart.com`
- Password: `admin123`

## Features

### Store Frontend
- Product browsing with filters, search, sorting
- Shopping cart with coupon codes
- Checkout with order creation
- User profile with order history
- Wishlist
- Real-time order status updates (Socket.IO)

### Admin Panel
- Dashboard with revenue & order charts
- Product management (CRUD + image upload)
- Order status management
- User list
- Coupon codes

## Tech Stack
- **Backend:** Node.js, Express.js, Socket.IO, MongoDB/Mongoose
- **Frontend:** Vanilla HTML/CSS/JS, Glassmorphism Dark UI
- **Real-time:** Socket.IO for live order alerts