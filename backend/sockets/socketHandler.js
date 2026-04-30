module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        // Admin joins admin room
        socket.on('joinAdmin', () => {
            socket.join('adminRoom');
            console.log(`Socket ${socket.id} joined adminRoom`);
        });

        // Customer joins their specific order room (or user room)
        socket.on('joinUserRoom', (userId) => {
            socket.join(`user_${userId}`);
            console.log(`Socket ${socket.id} joined user_${userId}`);
        });

        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
};
