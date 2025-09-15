# Real-Time WebSocket Communication with Socket.io

A robust real-time communication system built with Node.js, Express, Socket.io, and React for CodeVa Internship Task 2.

## 🚀 Features

### Core Functionality
- **Bidirectional Real-Time Communication** - Instant message delivery using WebSocket technology
- **Multiple Chat Rooms** - Switch between General, Tech Talk, Random, and Help & Support rooms
- **Private Messaging** - Send direct messages to specific users with real-time delivery
- **User Management** - Online/offline status tracking and user presence indicators
- **Typing Indicators** - See when other users are typing in real-time
- **Message History** - Persistent message storage with automatic cleanup
- **User Notifications** - Toast notifications for new messages and user activities

### Enhanced Features
- **Message Reactions** - React to messages with emoji reactions (👍, ❤️, 😂, 😮, 😢, 😡, 🎉, 🔥)
- **Message Search** - Search through messages and users with real-time filtering
- **Room Management** - Dynamic room switching with user count display
- **Interactive UI** - Hover effects, smooth animations, and intuitive controls
- **Real-Time Updates** - Live reaction counts and instant message synchronization

### Advanced Features
- **Scalable Architecture** - Production-ready design with efficient data handling
- **Security Implementation** - Rate limiting, CORS protection, and input validation
- **Responsive UI** - Modern TailwindCSS design with dark/light mode support
- **Performance Optimized** - Minimal data transfer with event-based updates
- **Error Handling** - Comprehensive error management and user feedback
- **Connection Management** - Automatic reconnection and connection status indicators

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **Socket.io** - Real-time bidirectional event-based communication
- **CORS** - Cross-origin resource sharing
- **Helmet.js** - Security middleware
- **Express Rate Limit** - Rate limiting middleware
- **UUID** - Unique identifier generation
- **dotenv** - Environment variable management

### Frontend
- **React 18** - Modern JavaScript library for building user interfaces
- **Vite** - Fast build tool and development server
- **Socket.io Client** - WebSocket client library
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **React Hot Toast** - Toast notification system
- **date-fns** - Date utility library

## 📁 Project Structure

```
realtime-websocket-chat/
├── client/                 # React frontend
│   ├── src/
│   │   ├── App.jsx        # Main React component
│   │   ├── main.jsx       # React entry point
│   │   └── index.css      # Global styles with Tailwind
│   ├── index.html         # HTML template
│   ├── package.json       # Frontend dependencies
│   ├── vite.config.js     # Vite configuration
│   ├── tailwind.config.js # Tailwind configuration
│   └── .env               # Frontend environment variables
├── server/                # Node.js backend
│   ├── index.js          # Main server file with Socket.io
│   ├── package.json      # Backend dependencies
│   └── .env              # Backend environment variables
├── package.json          # Root package.json for scripts
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd realtime-websocket-chat
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend client (port 5173) concurrently.

### Alternative: Manual Setup

1. **Start the backend server**
   ```bash
   cd server
   npm install
   npm run dev
   ```

2. **Start the frontend client** (in a new terminal)
   ```bash
   cd client
   npm install
   npm run dev
   ```

## 🌐 Usage

1. **Access the Application**
   - Open your browser and navigate to `http://localhost:5173`
   - The backend API runs on `http://localhost:5000`

2. **Join the Chat**
   - Enter a unique username (max 20 characters)
   - Click "Join Chat" to enter the general chat room

3. **Multiple Chat Rooms**
   - Click the room selector (grid icon) to see available rooms
   - Switch between General, Tech Talk, Random, and Help & Support
   - See user count for each room before joining
   - Messages are room-specific with persistent history

4. **Message Interactions**
   - React to messages with emoji reactions (hover over messages)
   - Click reaction buttons to add/remove your reactions
   - See who reacted with each emoji in tooltips
   - Search messages and users using the search toggle

5. **Private Messaging**
   - Click on any user in the user list
   - Click "Message" to start a private conversation
   - Send direct messages that only the recipient can see
   - Switch between public and private chats seamlessly

6. **Additional Features**
   - Toggle between dark and light themes
   - Search through message history and users
   - View message timestamps and delivery status
   - Receive browser notifications for new messages
   - See connection status in real-time

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Frontend (.env)**
```env
VITE_SERVER_URL=http://localhost:5000
VITE_APP_NAME=Real-time WebSocket Chat
VITE_APP_VERSION=1.0.0
```

## 📡 API Endpoints

### REST API
- `GET /api/health` - Health check endpoint
- `GET /api/stats` - System statistics (users, messages, uptime)

### Socket.io Events

**Client → Server**
- `user:join` - Join the chat with username
- `message:send` - Send public message
- `message:private` - Send private message
- `message:react` - Add/remove emoji reaction to message
- `room:switch` - Switch to different chat room
- `rooms:list` - Request available rooms list
- `typing:start` - Start typing indicator
- `typing:stop` - Stop typing indicator
- `chat:private:history` - Request private chat history
- `users:online` - Request online users list

**Server → Client**
- `user:joined` - User successfully joined
- `user:entered` - New user joined the room
- `user:left` - User left the room
- `message:received` - New public message
- `message:private:received` - New private message
- `message:reaction:updated` - Message reaction added/removed
- `room:joined` - Successfully joined new room
- `rooms:list` - Available rooms data
- `room:users` - Updated user list
- `typing:start` - User started typing
- `typing:stop` - User stopped typing
- `notification` - System notification
- `error` - Error message

## 🏗️ Architecture & Design Decisions

### Real-Time Communication
- **WebSocket Protocol** - Enables bidirectional, low-latency communication
- **Event-Driven Architecture** - Efficient message routing and handling
- **Room-Based System** - Scalable user grouping and message broadcasting

### Data Management
- **In-Memory Storage** - Fast access for development (Redis recommended for production)
- **Message Limiting** - Automatic cleanup to prevent memory leaks
- **User Session Management** - Efficient tracking of online/offline status

### Security Features
- **Rate Limiting** - Prevents spam and abuse (100 requests per 15 minutes)
- **Input Validation** - Sanitizes user input and prevents injection attacks
- **CORS Protection** - Restricts cross-origin requests to authorized domains
- **Helmet.js** - Sets various HTTP headers for security

### Performance Optimizations
- **Minimal Data Transfer** - Only essential data sent over WebSocket
- **Event-Based Updates** - Efficient real-time synchronization
- **Message Pagination** - Loads recent messages to reduce initial load time
- **Connection Management** - Automatic cleanup of disconnected users

## 🔄 Scalability Considerations

### Production Deployment
- **Redis Integration** - For horizontal scaling across multiple servers
- **Load Balancing** - Distribute connections across server instances
- **Database Integration** - Persistent storage for users and message history
- **CDN Integration** - Serve static assets efficiently

### Performance Monitoring
- **Health Check Endpoint** - Monitor server status and uptime
- **Statistics API** - Track user activity and system performance
- **Error Logging** - Comprehensive error tracking and debugging

## 🧪 Testing the System

### Multi-User Testing
1. Open multiple browser tabs or different browsers
2. Join with different usernames in each tab
3. Test public messaging between users
4. Test private messaging functionality
5. Verify typing indicators and notifications
6. Test connection/disconnection scenarios

### Feature Verification
- ✅ Real-time message delivery
- ✅ Private messaging system
- ✅ User presence indicators
- ✅ Typing indicators
- ✅ Notification system
- ✅ Responsive UI design
- ✅ Dark/light theme toggle
- ✅ Connection status monitoring

## 🚀 Production Deployment

### Build for Production
```bash
# Build the frontend
npm run build

# Start production server
npm start
```

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure proper `CLIENT_URL` for your domain
3. Set up SSL/TLS certificates
4. Configure reverse proxy (nginx recommended)
5. Set up process manager (PM2 recommended)

## 👨‍💻 Developer Information

**Developer:** Yakubu Abdul Manaf  
**Email:** yakubumamaf732hub@gmail.com  
**Project:** CodeVa Internship - Advanced Task 2  
**Technology Focus:** Real-Time WebSocket Communication  

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

This is an internship project, but feedback and suggestions are welcome! Please feel free to:
- Report bugs or issues
- Suggest new features
- Provide code improvements
- Share deployment experiences

## 📚 Learning Resources

- [Socket.io Documentation](https://socket.io/docs/)
- [React Documentation](https://react.dev/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [WebSocket Protocol Specification](https://tools.ietf.org/html/rfc6455)

---

Built with ❤️ for CodeVa Internship Program
