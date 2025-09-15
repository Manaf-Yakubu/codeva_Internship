import React, { useState, useEffect, useRef } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { 
  Send, 
  Users, 
  MessageCircle, 
  Settings, 
  Moon, 
  Sun, 
  Wifi, 
  WifiOff,
  Bell,
  X,
  User,
  Hash,
  Smile,
  Grid,
  ChevronDown,
  Search
} from 'lucide-react';
import { io } from 'socket.io-client';
import { formatDistanceToNow } from 'date-fns';

// Socket.io connection
const socket = io(import.meta.env.VITE_SERVER_URL || 'http://localhost:5000', {
  transports: ['websocket', 'polling'],
  timeout: 20000,
  forceNew: true
});

function App() {
  // Test if component renders
  console.log('App component is rendering');
  
  // State management
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [roomUsers, setRoomUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [privateChats, setPrivateChats] = useState(new Map());
  const [activePrivateChat, setActivePrivateChat] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [showRoomList, setShowRoomList] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Refs
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Socket event listeners
  useEffect(() => {
    // Connection events
    socket.on('connect', () => {
      setIsConnected(true);
      toast.success('Connected to server!');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      toast.error('Disconnected from server');
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      toast.error('Failed to connect to server');
    });

    // User events
    socket.on('user:joined', ({ user, room }) => {
      setUser(user);
      setCurrentRoom(room);
      setMessages(room.messages || []);
      setRoomUsers(room.users || []);
      toast.success(`Welcome to ${room.name}!`);
    });

    socket.on('user:entered', ({ user, message, timestamp }) => {
      const systemMessage = {
        id: `system-${Date.now()}`,
        content: message,
        type: 'system',
        timestamp: new Date(timestamp)
      };
      setMessages(prev => [...prev, systemMessage]);
      toast(`${user.username} joined the chat`, { icon: '👋' });
    });

    socket.on('user:left', ({ user, message, timestamp }) => {
      const systemMessage = {
        id: `system-${Date.now()}`,
        content: message,
        type: 'system',
        timestamp: new Date(timestamp)
      };
      setMessages(prev => [...prev, systemMessage]);
      toast(`${user.username} left the chat`, { icon: '👋' });
    });

    // Message events
    socket.on('message:received', (message) => {
      setMessages(prev => [...prev, message]);
      
      // Show notification if message is from another user
      if (user && message.sender.id !== user.id) {
        toast(`${message.sender.username}: ${message.content.substring(0, 50)}${message.content.length > 50 ? '...' : ''}`, {
          icon: '💬',
          duration: 3000
        });
      }
    });

    socket.on('message:private:received', (message) => {
      const chatId = message.chatId;
      setPrivateChats(prev => {
        const updated = new Map(prev);
        const chat = updated.get(chatId) || { messages: [], participant: null };
        chat.messages = [...chat.messages, message];
        
        // Set participant info
        if (user) {
          chat.participant = message.sender.id === user.id ? message.recipient : message.sender;
        }
        
        updated.set(chatId, chat);
        return updated;
      });

      // Show notification for received private messages
      if (user && message.sender.id !== user.id) {
        toast(`Private from ${message.sender.username}: ${message.content.substring(0, 30)}...`, {
          icon: '🔒',
          duration: 4000
        });
      }
    });

    // Room events
    socket.on('room:users', (users) => {
      setRoomUsers(users);
    });

    socket.on('users:online', (users) => {
      setOnlineUsers(users);
    });

    // Typing events
    socket.on('typing:start', ({ userId, username }) => {
      setTypingUsers(prev => {
        if (!prev.find(u => u.userId === userId)) {
          return [...prev, { userId, username }];
        }
        return prev;
      });
    });

    socket.on('typing:stop', ({ userId }) => {
      setTypingUsers(prev => prev.filter(u => u.userId !== userId));
    });

    // Notification events
    socket.on('notification', (notification) => {
      setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep last 10 notifications
      toast(notification.message, { icon: '🔔', duration: 4000 });
    });

    // Private chat history
    socket.on('chat:private:history', ({ chatId, messages }) => {
      setPrivateChats(prev => {
        const updated = new Map(prev);
        const chat = updated.get(chatId) || { messages: [], participant: null };
        chat.messages = messages;
        updated.set(chatId, chat);
        return updated;
      });
    });

    // Message reactions
    socket.on('message:reaction:updated', ({ messageId, reactions, user, reaction, action }) => {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, reactions } : msg
      ));
      
      if (user.id !== user?.id) {
        toast(`${user.username} ${action} ${reaction} reaction`, { 
          icon: reaction,
          duration: 2000 
        });
      }
    });

    // Room events
    socket.on('room:joined', ({ room }) => {
      setCurrentRoom(room);
      setMessages(room.messages || []);
      setRoomUsers(room.users || []);
      setActivePrivateChat(null);
      toast.success(`Joined ${room.name}!`);
    });

    socket.on('rooms:list', (rooms) => {
      setAvailableRooms(rooms);
    });

    // Error handling
    socket.on('error', ({ message }) => {
      toast.error(message);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('user:joined');
      socket.off('user:entered');
      socket.off('user:left');
      socket.off('message:received');
      socket.off('message:private:received');
      socket.off('room:users');
      socket.off('users:online');
      socket.off('typing:start');
      socket.off('typing:stop');
      socket.off('notification');
      socket.off('chat:private:history');
      socket.off('message:reaction:updated');
      socket.off('room:joined');
      socket.off('rooms:list');
      socket.off('error');
    };
  }, [user]);

  // Join chat function
  const joinChat = (e) => {
    e.preventDefault();
    if (username.trim()) {
      socket.emit('user:join', { username: username.trim() });
    }
  };

  // Send message function
  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    if (activePrivateChat) {
      // Send private message
      socket.emit('message:private', {
        content: newMessage.trim(),
        recipientId: activePrivateChat.id
      });
    } else {
      // Send public message
      socket.emit('message:send', {
        content: newMessage.trim(),
        roomId: currentRoom?.id
      });
    }

    setNewMessage('');
    
    // Stop typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    socket.emit('typing:stop', { roomId: currentRoom?.id });
  };

  // Handle typing
  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!activePrivateChat) {
      // Emit typing start
      socket.emit('typing:start', { roomId: currentRoom?.id });

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set timeout to stop typing
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing:stop', { roomId: currentRoom?.id });
      }, 1000);
    }
  };

  // Start private chat
  const startPrivateChat = (otherUser) => {
    setActivePrivateChat(otherUser);
    setShowUserList(false);
    
    // Request chat history
    socket.emit('chat:private:history', { otherUserId: otherUser.id });
  };

  // Get current messages (public or private)
  const getCurrentMessages = () => {
    if (activePrivateChat) {
      const chatId = [user?.id, activePrivateChat.id].sort().join('-');
      const chat = privateChats.get(chatId);
      return chat?.messages || [];
    }
    return messages;
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Clear notifications
  const clearNotifications = () => {
    setNotifications([]);
    setShowNotifications(false);
  };

  // Handle message reactions
  const handleReaction = (messageId, emoji) => {
    socket.emit('message:react', {
      messageId,
      reaction: emoji,
      roomId: currentRoom?.id
    });
    setShowEmojiPicker(null);
  };

  // Common emoji reactions
  const commonEmojis = ['👍', '❤️', '😂', '😮', '😢', '😡', '🎉', '🔥'];

  // Switch room function
  const switchRoom = (roomId) => {
    socket.emit('room:switch', { roomId });
    setShowRoomList(false);
  };

  // Request rooms list
  const requestRoomsList = () => {
    socket.emit('rooms:list');
    setShowRoomList(!showRoomList);
  };

  // Filter messages based on search query
  const getFilteredMessages = () => {
    const currentMessages = getCurrentMessages();
    if (!searchQuery.trim()) return currentMessages;
    
    return currentMessages.filter(message => 
      message.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.sender?.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Login screen
  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 ${darkMode ? 'dark' : ''}`}>
        <Toaster position="top-right" />
        
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Real-time Chat
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Join the conversation with WebSocket technology
            </p>
          </div>

          <form onSubmit={joinChat} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Choose your username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username..."
                className="chat-input"
                maxLength={20}
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={!username.trim() || !isConnected}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              <span>{isConnected ? 'Join Chat' : 'Connecting...'}</span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Built with ❤️ by Yakubu Abdul Manaf for CodeVa Internship
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main chat interface
  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${darkMode ? 'dark' : ''}`}>
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
              {activePrivateChat ? (
                <User className="w-5 h-5 text-white" />
              ) : (
                <Hash className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <h1 className="font-semibold text-gray-900 dark:text-white">
                {activePrivateChat ? `Chat with ${activePrivateChat.username}` : currentRoom?.name}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {activePrivateChat ? 'Private conversation' : `${roomUsers.length} members online`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Connection status */}
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
            
            {/* Room selector */}
            {!activePrivateChat && (
              <div className="relative">
                <button
                  onClick={requestRoomsList}
                  className="flex items-center space-x-1 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <Grid className="w-5 h-5" />
                  <ChevronDown className="w-3 h-3" />
                </button>
                
                {showRoomList && (
                  <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 z-20 min-w-48">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 px-2">
                      Available Rooms
                    </div>
                    {availableRooms.map((room) => (
                      <button
                        key={room.id}
                        onClick={() => switchRoom(room.id)}
                        className={`w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          currentRoom?.id === room.id ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : ''
                        }`}
                      >
                        <div className="font-medium text-sm">{room.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{room.description}</div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">{room.userCount} users</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Search toggle */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`p-2 transition-colors ${showSearch ? 'text-primary-500' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
            >
              <Search className="w-5 h-5" />
            </button>
            
            {/* Notifications */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Users list */}
            <button
              onClick={() => setShowUserList(!showUserList)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Users className="w-5 h-5" />
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Back to public chat */}
            {activePrivateChat && (
              <button
                onClick={() => setActivePrivateChat(null)}
                className="btn-secondary text-sm"
              >
                Back to {currentRoom?.name || 'General'}
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Main chat area */}
        <div className="flex-1 flex flex-col">
          {/* Search bar */}
          {showSearch && (
            <div className="border-b border-gray-200 dark:border-gray-700 p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search messages and users..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {searchQuery && (
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {getFilteredMessages().length} message(s) found
                </div>
              )}
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
            {getFilteredMessages().map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === 'system' 
                    ? 'justify-center' 
                    : message.sender?.id === user.id 
                      ? 'justify-end' 
                      : 'justify-start'
                } animate-fade-in`}
              >
                {message.type === 'system' ? (
                  <div className="text-center text-sm text-gray-500 dark:text-gray-400 italic">
                    {message.content}
                  </div>
                ) : (
                  <div className={`flex items-end space-x-2 ${message.sender?.id === user.id ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {message.sender?.id !== user.id && (
                      <div className="user-avatar">
                        {message.sender?.username?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <div className={`chat-message ${message.sender?.id === user.id ? 'own' : 'other'} relative group`}>
                      {message.sender?.id !== user.id && (
                        <div className="text-xs font-medium mb-1 text-gray-600 dark:text-gray-300">
                          {message.sender?.username}
                        </div>
                      )}
                      <div className="break-words">{message.content}</div>
                      
                      {/* Message reactions */}
                      {message.reactions && Object.keys(message.reactions).length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {Object.entries(message.reactions).map(([emoji, users]) => (
                            <button
                              key={emoji}
                              onClick={() => handleReaction(message.id, emoji)}
                              className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs transition-colors ${
                                users.some(u => u.userId === user.id)
                                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 border border-primary-300 dark:border-primary-700'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                              }`}
                              title={users.map(u => u.username).join(', ')}
                            >
                              <span>{emoji}</span>
                              <span>{users.length}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Reaction button */}
                      {!activePrivateChat && (
                        <button
                          onClick={() => setShowEmojiPicker(showEmojiPicker === message.id ? null : message.id)}
                          className="absolute -right-8 top-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"
                        >
                          <Smile className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        </button>
                      )}

                      {/* Emoji picker */}
                      {showEmojiPicker === message.id && (
                        <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 z-10">
                          <div className="grid grid-cols-4 gap-1">
                            {commonEmojis.map((emoji) => (
                              <button
                                key={emoji}
                                onClick={() => handleReaction(message.id, emoji)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-lg"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className={`text-xs mt-1 ${message.sender?.id === user.id ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'}`}>
                        {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {/* Typing indicator */}
            {typingUsers.length > 0 && !activePrivateChat && (
              <div className="typing-indicator">
                <div className="typing-dots">
                  <div className="typing-dot" style={{ animationDelay: '0ms' }} />
                  <div className="typing-dot" style={{ animationDelay: '150ms' }} />
                  <div className="typing-dot" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="ml-2">
                  {typingUsers.map(u => u.username).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                </span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <form onSubmit={sendMessage} className="flex space-x-2">
              <input
                ref={messageInputRef}
                type="text"
                value={newMessage}
                onChange={handleTyping}
                placeholder={`Message ${activePrivateChat ? activePrivateChat.username : currentRoom?.name}...`}
                className="chat-input flex-1"
                maxLength={500}
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar for users/notifications */}
        {(showUserList || showNotifications) && (
          <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
            {showUserList && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Online Users</h3>
                  <button
                    onClick={() => setShowUserList(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  {roomUsers.map((roomUser) => (
                    <div
                      key={roomUser.id}
                      className={`flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 ${
                        roomUser.id === user.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="user-avatar">
                            {roomUser.username[0].toUpperCase()}
                          </div>
                          {roomUser.isOnline && <div className="online-indicator" />}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {roomUser.username} {roomUser.id === user.id && '(You)'}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {roomUser.isOnline ? 'Online' : 'Offline'}
                          </div>
                        </div>
                      </div>
                      {roomUser.id !== user.id && (
                        <button
                          onClick={() => startPrivateChat(roomUser)}
                          className="text-primary-500 hover:text-primary-600 text-sm font-medium"
                        >
                          Message
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showNotifications && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={clearNotifications}
                      className="text-sm text-primary-500 hover:text-primary-600"
                    >
                      Clear all
                    </button>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  {notifications.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
                      No notifications yet
                    </p>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="font-medium text-gray-900 dark:text-white text-sm">
                          {notification.title}
                        </div>
                        <div className="text-gray-600 dark:text-gray-300 text-sm">
                          {notification.message}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
