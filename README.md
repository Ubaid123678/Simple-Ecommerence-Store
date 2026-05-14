# NovaMart — E-Commerce Store

A full-featured e-commerce application with customer storefront and separate admin panel. Built with Node.js, Express, MongoDB, and vanilla HTML/CSS/JS.

![NovaMart](https://img.shields.io/badge/Version-1.0.0-purple)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![Socket.IO](https://img.shields.io/badge/RealTime-Socket.IO-blue)

---

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Features](#features)
- [Pages Overview](#pages-overview)
- [Categories](#categories)
- [API Endpoints](#api-endpoints)
- [Tech Stack](#tech-stack)
- [Default Credentials](#default-credentials)
- [How to Use](#how-to-use)

---

## 🚀 Quick Start

### 1. Start MongoDB
```bash
# Using MongoDB Compass or CLI
mongod
```
**Database:** `mongodb://localhost:27017/novamart`

### 2. Start Backend Server
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

### 3. Access Applications

| App | URL |
|-----|-----|
| **Store (Home)** | http://localhost:5000 |
| **Admin Panel** | http://localhost:5000/admin |
| **API** | http://localhost:5000/api |

---

## 📁 Project Structure

```
novamart/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic
│   ├── middleware/     # Auth, upload, admin
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API routes
│   ├── sockets/        # Real-time handlers
│   ├── seeds/          # Database seeding
│   └── server.js       # Entry point
│
├── frontend/           # Customer-facing website
│   ├── index.html      # Home page
│   ├── auth.html       # Login/Register
│   ├── product.html    # Product detail
│   ├── cart.html       # Shopping cart
│   ├── checkout.html   # Checkout
│   ├── wishlist.html   # Wishlist
│   ├── profile.html    # User profile
│   ├── about.html      # About us
│   ├── contact.html    # Contact form
│   ├── order-success.html
│   ├── css/            # Styles & animations
│   └── js/             # Frontend logic
│
├── admin-panel/        # Admin dashboard
│   ├── index.html      # Dashboard
│   ├── products.html   # Product management
│   ├── orders.html     # Order management
│   ├── users.html      # User management
│   ├── coupons.html    # Coupon management
│   ├── login.html      # Admin login
│   ├── css/            # Admin styles
│   └── js/             # Admin logic
│
└── README.md
```

---

## ✨ Features

### Store Frontend (Customer)

| Feature | Description |
|---------|-------------|
| **Product Browsing** | Filter by category, search, sort by price/rating |
| **Categories** | Electronics, Clothing, Sports, Furniture, Books |
| **Shopping Cart** | Add/remove items, quantity controls, coupon codes |
| **Checkout** | Address form, order creation, coupon validation |
| **User Profile** | View order history, manage wishlist |
| **Wishlist** | Save products for later |
| **About Page** | Company information |
| **Contact Form** | Send messages to admin (stored locally) |
| **Real-time Updates** | Socket.IO for live notifications |

### Admin Panel

| Feature | Description |
|---------|-------------|
| **Dashboard** | Stats cards, revenue chart, order status chart |
| **Product Management** | Create, edit, delete products with image upload |
| **Order Management** | View orders, update status (Pending → Delivered) |
| **User Management** | View all registered users |
| **Coupon Management** | Create, edit, delete discount codes |
| **Contact Messages** | View customer inquiries |
| **Real-time Alerts** | New order notifications |

---

## 📄 Pages Overview

### Frontend Pages
| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero, categories, products grid, features, newsletter |
| Login/Register | `/auth.html` | Tab-based auth forms |
| Product Detail | `/product.html?id=` | Product info, images, reviews, add to cart |
| Cart | `/cart.html` | Cart items, quantity, coupon, checkout button |
| Checkout | `/checkout.html` | Shipping address, order summary |
| Wishlist | `/wishlist.html` | Saved products |
| Profile | `/profile.html` | User info, orders tab, wishlist tab |
| About | `/about.html` | Company story, mission, values |
| Contact | `/contact.html` | Contact form with subject selection |
| Order Success | `/order-success.html?id=` | Order confirmation |

### Admin Pages
| Page | Route | Description |
|------|-------|-------------|
| Login | `/admin/login.html` | Admin authentication |
| Dashboard | `/admin/index.html` | Stats, charts, recent orders, contact messages |
| Products | `/admin/products.html` | Full product CRUD with modal form |
| Orders | `/admin/orders.html` | Order list with status management |
| Users | `/admin/users.html` | User list |
| Coupons | `/admin/coupons.html` | Coupon CRUD |

---

## 🏷️ Categories

All categories are available in both store and admin:

1. **Electronics** - Phones, audio, gadgets
2. **Clothing** - Fashion, apparel, accessories
3. **Sports** - Fitness, outdoor, equipment
4. **Furniture** - Home & office furniture
5. **Books** - Knowledge & fiction

---
## Live Preview
<video src="./preview.mp4" width="100%" controls autoplay loop muted></video>

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - List products (paginated)
- `GET /api/products/all` - Get all products (admin)
- `GET /api/products/:id` - Get single product

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update quantity
- `DELETE /api/cart/remove/:productId` - Remove item

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders

### Coupons
- `POST /api/coupons/validate` - Validate coupon code

### Admin (Protected)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/stats` - Dashboard statistics
- `GET/POST /api/admin/products` - Product CRUD
- `GET /api/admin/orders` - All orders
- `PUT /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/users` - All users
- `GET/POST /api/admin/coupons` - Coupon CRUD

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Real-time:** Socket.IO
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **File Upload:** Multer
- **Environment:** dotenv

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Custom properties, animations, glassmorphism
- **JavaScript (ES6+)** - Vanilla JS, no frameworks
- **HTTP Client:** Fetch API

### UI Design
- **Theme:** Dark glassmorphism
- **Colors:** Purple primary (#8B5CF6), Cyan accent (#22D3EE), Green accent (#06D6A0)
- **Fonts:** Outfit (headings), Inter (body)
- **Animations:** Fade, slide, hover effects, transitions

---

## 🔑 Default Credentials

### Customer Account
- Register new account at: http://localhost:5000/auth.html#register

### Admin Account
```
Email:    admin@novamart.com
Password: admin123
```

---

## 📖 How to Use

### For Customers

1. **Browse Products**
   - Click category cards to filter
   - Use search bar in navbar
   - Sort by price/rating

2. **Add to Cart**
   - Click heart icon for wishlist
   - Click cart icon to add

3. **Checkout**
   - Enter address details
   - Apply coupon code (e.g., WELCOME10)
   - Place order

4. **Track Orders**
   - View in profile page
   - Real-time status updates

### For Admins

1. **Login** → http://localhost:5000/admin/login.html

2. **Manage Products**
   - Add new products with images
   - Edit existing products
   - Delete products

3. **Process Orders**
   - View new orders
   - Update status: Pending → Processing → Shipped → Delivered

4. **Create Coupons**
   - Set discount percentage
   - Set usage limit
   - Set expiration date

5. **Contact Messages**
   - View customer inquiries from dashboard

---

## 📝 Notes

- Database seeded with 20+ sample products across all categories
- Images stored in `/backend/uploads/`
- Socket.IO handles real-time order notifications to admin
- Contact form messages stored in localStorage (accessible to admin)

---

## 📄 License

MIT License — Built for Internship Project 1

---

**Built with ❤️ using Node.js + MongoDB + Vanilla JS**