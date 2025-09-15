const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Socket.io setup with CORS configuration
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false
}));

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use(limiter);
app.use(express.json());

// In-memory storage for users and rooms (in production, use Redis or database)
const users = new Map(); // userId -> { id, username, socketId, room, isOnline }
const rooms = new Map(); // roomId -> { id, name, users: Set, messages: [] }
const privateChats = new Map(); // chatId -> { participants: Set, messages: [] }

// Default public rooms
const DEFAULT_ROOMS = {
  'general': { id: 'general', name: 'General Chat', description: 'Main chat room for everyone', users: new Set(), messages: [] },
  'tech': { id: 'tech', name: 'Tech Talk', description: 'Discuss technology and programming', users: new Set(), messages: [] },
  'random': { id: 'random', name: 'Random', description: 'Off-topic conversations', users: new Set(), messages: [] },
  'help': { id: 'help', name: 'Help & Support', description: 'Get help from the community', users: new Set(), messages: [] }
};

// Initialize default rooms
Object.values(DEFAULT_ROOMS).forEach(room => {
  rooms.set(room.id, room);
});

const PUBLIC_ROOM = 'general';

// Helper functions
const getUserBySocketId = (socketId) => {
  for (const [userId, user] of users) {
    if (user.socketId === socketId) return user;
  }
  return null;
};

const getRoomUsers = (roomId) => {
  const room = rooms.get(roomId);
  if (!room) return [];
  
  return Array.from(room.users).map(userId => {
    const user = users.get(userId);
    return user ? { id: user.id, username: user.username, isOnline: user.isOnline } : null;
  }).filter(Boolean);
};

const addMessageToRoom = (roomId, message) => {
  const room = rooms.get(roomId);
  if (room) {
    room.messages.push(message);
    // Keep only last 100 messages per room for memory efficiency
    if (room.messages.length > 100) {
      room.messages = room.messages.slice(-100);
    }
  }
};

const createPrivateChat = (user1Id, user2Id) => {
  const chatId = [user1Id, user2Id].sort().join('-');
  if (!privateChats.has(chatId)) {
    privateChats.set(chatId, {
      participants: new Set([user1Id, user2Id]),
      messages: []
    });
  }
  return chatId;
};

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // User joins the system
  socket.on('user:join', ({ username }) => {
    try {
      if (!username || username.trim().length === 0) {
        socket.emit('error', { message: 'Username is required' });
        return;
      }

      // Check if username is already taken
      const existingUser = Array.from(users.values()).find(user => 
        user.username.toLowerCase() === username.toLowerCase() && user.isOnline
      );

      if (existingUser) {
        socket.emit('error', { message: 'Username is already taken' });
        return;
      }

      const userId = uuidv4();
      const user = {
        id: userId,
        username: username.trim(),
        socketId: socket.id,
        room: PUBLIC_ROOM,
        isOnline: true,
        joinedAt: new Date()
      };

      users.set(userId, user);
      socket.userId = userId;

      // Join the default public room
      socket.join(PUBLIC_ROOM);
      const room = rooms.get(PUBLIC_ROOM);
      room.users.add(userId);

      // Send user data and room info
      socket.emit('user:joined', {
        user: { id: user.id, username: user.username },
        room: {
          id: PUBLIC_ROOM,
          name: room.name,
          users: getRoomUsers(PUBLIC_ROOM),
          messages: room.messages.slice(-50) // Send last 50 messages
        }
      });

      // Notify others in the room
      socket.to(PUBLIC_ROOM).emit('user:entered', {
        user: { id: user.id, username: user.username },
        message: `${user.username} joined the chat`,
        timestamp: new Date()
      });

      // Send updated user list to all users in the room
      io.to(PUBLIC_ROOM).emit('room:users', getRoomUsers(PUBLIC_ROOM));

      console.log(`User ${username} (${userId}) joined room ${PUBLIC_ROOM}`);
    } catch (error) {
      console.error('Error in user:join:', error);
      socket.emit('error', { message: 'Failed to join chat' });
    }
  });

  // Handle public room messages
  socket.on('message:send', ({ content, roomId = PUBLIC_ROOM }) => {
    try {
      const user = getUserBySocketId(socket.id);
      if (!user) {
        socket.emit('error', { message: 'User not found' });
        return;
      }

      if (!content || content.trim().length === 0) {
        socket.emit('error', { message: 'Message content is required' });
        return;
      }

      const message = {
        id: uuidv4(),
        content: content.trim(),
        sender: {
          id: user.id,
          username: user.username
        },
        roomId,
        timestamp: new Date(),
        type: 'message'
      };

      // Add message to room
      addMessageToRoom(roomId, message);

      // Broadcast message to all users in the room
      io.to(roomId).emit('message:received', message);

      console.log(`Message sent by ${user.username} in room ${roomId}: ${content}`);
    } catch (error) {
      console.error('Error in message:send:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Handle private messages
  socket.on('message:private', ({ content, recipientId }) => {
    try {
      const sender = getUserBySocketId(socket.id);
      const recipient = users.get(recipientId);

      if (!sender) {
        socket.emit('error', { message: 'Sender not found' });
        return;
      }

      if (!recipient) {
        socket.emit('error', { message: 'Recipient not found' });
        return;
      }

      if (!content || content.trim().length === 0) {
        socket.emit('error', { message: 'Message content is required' });
        return;
      }

      const chatId = createPrivateChat(sender.id, recipient.id);
      const privateChat = privateChats.get(chatId);

      const message = {
        id: uuidv4(),
        content: content.trim(),
        sender: {
          id: sender.id,
          username: sender.username
        },
        recipient: {
          id: recipient.id,
          username: recipient.username
        },
        chatId,
        timestamp: new Date(),
        type: 'private'
      };

      // Add message to private chat
      privateChat.messages.push(message);
      if (privateChat.messages.length > 100) {
        privateChat.messages = privateChat.messages.slice(-100);
      }

      // Send message to both sender and recipient
      socket.emit('message:private:received', message);
      
      if (recipient.isOnline && recipient.socketId) {
        io.to(recipient.socketId).emit('message:private:received', message);
        
        // Send notification to recipient
        io.to(recipient.socketId).emit('notification', {
          id: uuidv4(),
          type: 'private_message',
          title: 'New Private Message',
          message: `${sender.username} sent you a message`,
          sender: { id: sender.id, username: sender.username },
          timestamp: new Date()
        });
      }

      console.log(`Private message from ${sender.username} to ${recipient.username}: ${content}`);
    } catch (error) {
      console.error('Error in message:private:', error);
      socket.emit('error', { message: 'Failed to send private message' });
    }
  });

  // Handle typing indicators
  socket.on('typing:start', ({ roomId = PUBLIC_ROOM }) => {
    const user = getUserBySocketId(socket.id);
    if (user) {
      socket.to(roomId).emit('typing:start', {
        userId: user.id,
        username: user.username,
        roomId
      });
    }
  });

  socket.on('typing:stop', ({ roomId = PUBLIC_ROOM }) => {
    const user = getUserBySocketId(socket.id);
    if (user) {
      socket.to(roomId).emit('typing:stop', {
        userId: user.id,
        username: user.username,
        roomId
      });
    }
  });

  // Get private chat history
  socket.on('chat:private:history', ({ otherUserId }) => {
    try {
      const user = getUserBySocketId(socket.id);
      if (!user) {
        socket.emit('error', { message: 'User not found' });
        return;
      }

      const chatId = createPrivateChat(user.id, otherUserId);
      const privateChat = privateChats.get(chatId);
      
      socket.emit('chat:private:history', {
        chatId,
        messages: privateChat.messages.slice(-50) // Send last 50 messages
      });
    } catch (error) {
      console.error('Error in chat:private:history:', error);
      socket.emit('error', { message: 'Failed to get chat history' });
    }
  });

  // Handle message reactions
  socket.on('message:react', ({ messageId, reaction, roomId = PUBLIC_ROOM }) => {
    try {
      const user = getUserBySocketId(socket.id);
      if (!user) {
        socket.emit('error', { message: 'User not found' });
        return;
      }

      const room = rooms.get(roomId);
      if (!room) {
        socket.emit('error', { message: 'Room not found' });
        return;
      }

      // Find the message in the room
      const message = room.messages.find(msg => msg.id === messageId);
      if (!message) {
        socket.emit('error', { message: 'Message not found' });
        return;
      }

      // Initialize reactions if not exists
      if (!message.reactions) {
        message.reactions = {};
      }

      // Initialize reaction type if not exists
      if (!message.reactions[reaction]) {
        message.reactions[reaction] = [];
      }

      // Check if user already reacted with this emoji
      const existingReactionIndex = message.reactions[reaction].findIndex(r => r.userId === user.id);
      
      if (existingReactionIndex > -1) {
        // Remove existing reaction
        message.reactions[reaction].splice(existingReactionIndex, 1);
        
        // Remove reaction type if no users left
        if (message.reactions[reaction].length === 0) {
          delete message.reactions[reaction];
        }
      } else {
        // Add new reaction
        message.reactions[reaction].push({
          userId: user.id,
          username: user.username,
          timestamp: new Date()
        });
      }

      // Broadcast reaction update to all users in the room
      io.to(roomId).emit('message:reaction:updated', {
        messageId,
        reactions: message.reactions,
        user: { id: user.id, username: user.username },
        reaction,
        action: existingReactionIndex > -1 ? 'removed' : 'added'
      });

      console.log(`User ${user.username} ${existingReactionIndex > -1 ? 'removed' : 'added'} reaction ${reaction} to message ${messageId}`);
    } catch (error) {
      console.error('Error in message:react:', error);
      socket.emit('error', { message: 'Failed to add reaction' });
    }
  });

  // Switch room
  socket.on('room:switch', ({ roomId }) => {
    try {
      const user = getUserBySocketId(socket.id);
      if (!user) {
        socket.emit('error', { message: 'User not found' });
        return;
      }

      const newRoom = rooms.get(roomId);
      if (!newRoom) {
        socket.emit('error', { message: 'Room not found' });
        return;
      }

      const oldRoom = rooms.get(user.room);
      
      // Leave old room
      if (oldRoom) {
        socket.leave(user.room);
        oldRoom.users.delete(user.id);
        
        // Notify others in old room
        socket.to(user.room).emit('user:left', {
          user: { id: user.id, username: user.username },
          message: `${user.username} left the room`,
          timestamp: new Date()
        });
        
        // Send updated user list to old room
        io.to(user.room).emit('room:users', getRoomUsers(user.room));
      }

      // Join new room
      socket.join(roomId);
      newRoom.users.add(user.id);
      user.room = roomId;

      // Send room data to user
      socket.emit('room:joined', {
        room: {
          id: newRoom.id,
          name: newRoom.name,
          description: newRoom.description,
          users: getRoomUsers(roomId),
          messages: newRoom.messages.slice(-50)
        }
      });

      // Notify others in new room
      socket.to(roomId).emit('user:entered', {
        user: { id: user.id, username: user.username },
        message: `${user.username} joined the room`,
        timestamp: new Date()
      });

      // Send updated user list to new room
      io.to(roomId).emit('room:users', getRoomUsers(roomId));

      console.log(`User ${user.username} switched from ${oldRoom?.name || 'unknown'} to ${newRoom.name}`);
    } catch (error) {
      console.error('Error in room:switch:', error);
      socket.emit('error', { message: 'Failed to switch room' });
    }
  });

  // Get available rooms
  socket.on('rooms:list', () => {
    const roomsList = Array.from(rooms.values()).map(room => ({
      id: room.id,
      name: room.name,
      description: room.description,
      userCount: room.users.size
    }));
    socket.emit('rooms:list', roomsList);
  });

  // Get online users
  socket.on('users:online', () => {
    const onlineUsers = Array.from(users.values())
      .filter(user => user.isOnline)
      .map(user => ({
        id: user.id,
        username: user.username,
        room: user.room,
        joinedAt: user.joinedAt
      }));

    socket.emit('users:online', onlineUsers);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    try {
      const user = getUserBySocketId(socket.id);
      if (user) {
        // Mark user as offline
        user.isOnline = false;
        user.socketId = null;

        // Remove user from their current room
        const room = rooms.get(user.room);
        if (room) {
          room.users.delete(user.id);
          
          // Notify others in the room
          socket.to(user.room).emit('user:left', {
            user: { id: user.id, username: user.username },
            message: `${user.username} left the chat`,
            timestamp: new Date()
          });

          // Send updated user list
          io.to(user.room).emit('room:users', getRoomUsers(user.room));
        }

        console.log(`User ${user.username} (${user.id}) disconnected`);
      }
    } catch (error) {
      console.error('Error in disconnect:', error);
    }
  });
});

// REST API endpoints
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date(),
    uptime: process.uptime(),
    users: users.size,
    rooms: rooms.size,
    privateChats: privateChats.size
  });
});

app.get('/api/stats', (req, res) => {
  const onlineUsers = Array.from(users.values()).filter(user => user.isOnline).length;
  const totalMessages = Array.from(rooms.values()).reduce((total, room) => total + room.messages.length, 0);
  const privateMessages = Array.from(privateChats.values()).reduce((total, chat) => total + chat.messages.length, 0);

  res.json({
    onlineUsers,
    totalUsers: users.size,
    totalRooms: rooms.size,
    totalMessages: totalMessages + privateMessages,
    publicMessages: totalMessages,
    privateMessages,
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Real-time WebSocket server running on port ${PORT}`);
  console.log(`🌍 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📈 Stats: http://localhost:${PORT}/api/stats`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
