// Socket.IO client for customer store

let socket = null;

function initSocket() {
    const user = getUser();
    if (!user) return;

    socket = io('http://localhost:5000');

    socket.on('connect', () => {
        console.log('Socket connected:', socket.id);
        socket.emit('joinUserRoom', user._id);
    });

    socket.on('orderStatusUpdate', (order) => {
        showToast(`Order #${order._id.slice(-6).toUpperCase()} status updated to: ${order.status}`, 'info', 5000);
    });

    socket.on('disconnect', () => {
        console.log('Socket disconnected');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (getUser()) {
        initSocket();
    }
});
