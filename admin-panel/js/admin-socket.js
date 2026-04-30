// Admin Socket.IO client — real-time new order alerts

let adminSocket = null;

function initAdminSocket() {
    if (!getAdmin()) return;

    adminSocket = io('http://localhost:5000');

    adminSocket.on('connect', () => {
        console.log('Admin socket connected:', adminSocket.id);
        adminSocket.emit('joinAdmin');
    });

    adminSocket.on('newOrder', (order) => {
        showToast(`🛒 New order received! #${order._id.slice(-6).toUpperCase()} — ${formatMoney(order.total)}`, 'success', 6000);

        // Show notification dot
        const dot = document.getElementById('notifDot');
        if (dot) dot.style.display = 'block';

        // Update badge
        const badge = document.getElementById('orderBadge');
        if (badge) {
            const current = parseInt(badge.textContent) || 0;
            badge.textContent = current + 1;
            badge.style.display = 'flex';
        }

        // Show floating alert
        showNewOrderAlert(order);

        // Refresh dashboard if on dashboard
        if (typeof loadDashboard === 'function') loadDashboard();
        // Refresh orders table if on orders page
        if (typeof loadOrders === 'function') loadOrders();
    });

    adminSocket.on('disconnect', () => {
        console.log('Admin socket disconnected');
    });
}

function showNewOrderAlert(order) {
    let alert = document.getElementById('newOrderAlert');
    if (!alert) {
        alert = document.createElement('div');
        alert.id = 'newOrderAlert';
        alert.className = 'new-order-alert';
        document.body.appendChild(alert);
    }
    alert.innerHTML = `🛒 New Order #${order._id.slice(-6).toUpperCase()} — ${formatMoney(order.total)}`;
    setTimeout(() => alert.classList.add('show'), 50);
    setTimeout(() => { alert.classList.remove('show'); }, 4000);
}

document.addEventListener('DOMContentLoaded', () => {
    if (getAdmin()) initAdminSocket();
});
