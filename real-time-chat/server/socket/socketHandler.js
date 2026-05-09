const User = require('../models/User');

let users = []; 

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    
    socket.on('addUser', async (userId) => {
      const user = users.find(u => u.userId === userId);
      if (!user) {
        users.push({ userId, socketId: socket.id });
      } else {
        user.socketId = socket.id;
      }
      
      
      await User.findByIdAndUpdate(userId, { status: 'online' });
      io.emit('getUsers', users);
    });


    socket.on('sendMessage', ({ senderId, receiverId, message }) => {
      const user = users.find(u => u.userId === receiverId);
      if (user) {
        io.to(user.socketId).emit('receiveMessage', message);
        io.to(user.socketId).emit('notification', {
          title: "New Message",
          body: message.text || "Image received"
        });
      }
    });

    
    socket.on('typing', ({ receiverId, isTyping }) => {
      const user = users.find(u => u.userId === receiverId);
      if (user) {
        io.to(user.socketId).emit('typing', isTyping);
      }
    });

    
    socket.on('disconnect', async () => {
      const user = users.find(u => u.socketId === socket.id);
      if (user) {
        await User.findByIdAndUpdate(user.userId, { status: 'offline' });
        users = users.filter(u => u.socketId !== socket.id);
        io.emit('getUsers', users);
      }
      console.log('User disconnected');
    });
  });
};