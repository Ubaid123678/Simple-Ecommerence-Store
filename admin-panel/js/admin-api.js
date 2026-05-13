const API_BASE = 'http://localhost:5000/api';

function getAdminToken() { return localStorage.getItem('novamart_admin_token'); }
function getAdmin() { const a = localStorage.getItem('novamart_admin'); return a ? JSON.parse(a) : null; }

function requireAdmin() {
    if (!getAdmin()) { window.location.href = 'login.html'; return false; }
    return true;
}

async function adminAPI(endpoint, options = {}) {
    const token = getAdminToken();
    const headers = { ...options.headers };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (!(options.body instanceof FormData)) headers['Content-Type'] = 'application/json';

    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
}

const AdminAPI = {
    login: (email, password) => adminAPI('/admin/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    getStats: () => adminAPI('/admin/stats'),
    // Products - use /all endpoint to get all products
    getProducts: () => adminAPI('/products/all'),
    createProduct: (formData) => adminAPI('/admin/products', { method: 'POST', body: formData }),
    updateProduct: (id, formData) => adminAPI(`/admin/products/${id}`, { method: 'PUT', body: formData }),
    deleteProduct: (id) => adminAPI(`/admin/products/${id}`, { method: 'DELETE' }),
    // Orders
    getOrders: () => adminAPI('/admin/orders'),
    updateOrderStatus: (id, status) => adminAPI(`/admin/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
    // Users
    getUsers: () => adminAPI('/admin/users'),
    // Coupons - admin endpoints
    getCoupons: () => adminAPI('/admin/coupons'),
    createCoupon: (data) => adminAPI('/admin/coupons', { method: 'POST', body: JSON.stringify(data) }),
    updateCoupon: (id, data) => adminAPI(`/admin/coupons/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteCoupon: (id) => adminAPI(`/admin/coupons/${id}`, { method: 'DELETE' }),
    // Contact messages
    getContactMessages: () => {
        const messages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
        return Promise.resolve(messages);
    }
};
