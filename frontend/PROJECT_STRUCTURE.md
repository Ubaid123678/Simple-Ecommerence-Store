# NovaMart - E-Commerce Frontend Structure

```
frontend/
├── index.html              # Home page
├── auth.html              # Login/Signup
├── product.html           # Product detail
├── cart.html              # Shopping cart
├── checkout.html          # Checkout
├── wishlist.html          # Wishlist
├── profile.html           # User profile/dashboard
├── order-success.html     # Order confirmation
├── about.html             # About page (NEW)
├── contact.html           # Contact page (NEW)
│
├── admin/
│   ├── index.html         # Admin dashboard
│   ├── products.html      # Product management
│   ├── orders.html        # Order management
│   ├── users.html         # User management
│   └── coupons.html      # Coupon management
│
├── css/
│   ├── style.css          # Main styles
│   ├── animations.css     # Animations
│   ├── responsive.css     # Responsive utilities (NEW)
│   └── admin.css         # Admin-specific styles (NEW)
│
├── js/
│   ├── api.js            # API calls
│   ├── ui.js             # UI components
│   ├── router.js         # Hash-based routing (NEW)
│   ├── store.js          # Local storage state (NEW)
│   ├── products.js       # Product listing
│   ├── cart.js           # Cart functionality
│   ├── checkout.js       # Checkout flow
│   ├── auth.js           # Authentication
│   ├── wishlist.js       # Wishlist functionality
│   ├── profile.js        # User profile
│   ├── product-detail.js # Product details
│   ├── admin.js          # Admin functionality (NEW)
│   └── components/       # Reusable components (NEW)
│       ├── navbar.js
│       ├── footer.js
│       ├── modal.js
│       └── toast.js
│
├── assets/
│   ├── images/            # Images
│   └── icons/            # Icons
│
└── README.md
```

## Phase 1: MVP (Current)
- ✅ Home page with products
- ✅ Login/Signup
- ✅ Product listing & detail
- ✅ Cart & checkout
- ✅ User profile
- ✅ Wishlist

## Phase 2: Enhancement
- [ ] About page
- [ ] Contact page with form
- [ ] Admin panel

## Phase 3: Polish
- [ ] Advanced routing
- [ ] State management
- [ ] Performance optimization