const API_BASE = 'http://localhost:5000/api';

function getToken() {
    return localStorage.getItem('novamart_token');
}

function getUser() {
    const user = localStorage.getItem('novamart_user');
    return user ? JSON.parse(user) : null;
}

async function apiRequest(endpoint, options = {}) {
    const token = getToken();
    const headers = {
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Only set Content-Type for JSON requests (not FormData)
    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Auth
const AuthAPI = {
    register: (name, email, password) => apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
    }),
    login: (email, password) => apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    }),
    getProfile: () => apiRequest('/auth/profile')
};

// Products
const ProductAPI = {
    getAll: (keyword = '', pageNumber = 1) => apiRequest(`/products?keyword=${keyword}&pageNumber=${pageNumber}`),
    getById: (id) => apiRequest(`/products/${id}`),
    getReviews: (id) => apiRequest(`/products/${id}/reviews`),
    addReview: (id, rating, comment) => apiRequest(`/products/${id}/reviews`, {
        method: 'POST',
        body: JSON.stringify({ rating, comment })
    })
};

// Cart
const CartAPI = {
    get: () => apiRequest('/cart'),
    add: (productId, quantity = 1) => apiRequest('/cart', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity })
    }),
    update: (itemId, quantity) => apiRequest(`/cart/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity })
    }),
    remove: (itemId) => apiRequest(`/cart/${itemId}`, {
        method: 'DELETE'
    })
};

// Orders
const OrderAPI = {
    create: (orderData) => apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData)
    }),
    getMine: () => apiRequest('/orders/mine'),
    getById: (id) => apiRequest(`/orders/${id}`)
};

// Wishlist
const WishlistAPI = {
    get: () => apiRequest('/wishlist'),
    add: (productId) => apiRequest('/wishlist', {
        method: 'POST',
        body: JSON.stringify({ productId })
    }),
    remove: (productId) => apiRequest(`/wishlist/${productId}`, {
        method: 'DELETE'
    })
};

// Coupons
const CouponAPI = {
    validate: (code) => apiRequest('/coupons/validate', {
        method: 'POST',
        body: JSON.stringify({ code })
    })
};
