import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';

const socket = io.connect(process.env.REACT_APP_API_URL);

const Home = () => {
  const { user, logout } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typing, setTyping] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef();

  const getToken = () =>
    localStorage.getItem('token') || localStorage.getItem('userToken') || localStorage.getItem('jwt');

  // Socket setup
  useEffect(() => {
    socket.emit('addUser', user.id);
    socket.on('getUsers', (users) => setOnlineUsers(users.map(u => u.userId)));
    socket.on('receiveMessage', (data) => setArrivalMessage(data));
    socket.on('typing', (isTyping) => setTyping(isTyping));

    return () => {
      socket.off('getUsers');
      socket.off('receiveMessage');
      socket.off('typing');
    };
  }, [user.id]);

  // Fetch conversations
  useEffect(() => {
    axios.get('/api/conversations', {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
      .then(res => setConversations(res.data))
      .catch(err => console.error("Conversation fetch error:", err));
  }, []);

  // Fetch messages when chat selected
  useEffect(() => {
    if (!currentChat?._id) return;
    axios.get(`/api/messages/${currentChat._id}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
      .then(res => setMessages(res.data))
      .catch(err => console.error("Message fetch error:", err));
  }, [currentChat]);

  // Arrival message from socket — only add if not already in state (prevents duplicates)
  useEffect(() => {
    if (!arrivalMessage) return;
    const senderId = arrivalMessage.sender?._id || arrivalMessage.senderId;
    const belongsToChat = currentChat?.members.some(m => m._id === senderId);
    if (!belongsToChat) return;
    setMessages(prev => {
      if (prev.some(m => m._id === arrivalMessage._id)) return prev;
      return [...prev, arrivalMessage];
    });
  }, [arrivalMessage, currentChat]);

  // Auto scroll to latest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectConversation = (conv) => {
    setMessages([]);
    setCurrentChat(conv);
  };

  const handleSendMsg = async () => {
    if (!newMessage.trim()) return;

    const userId = user._id || user.id;
    const receiver = currentChat.members.find(m => m._id !== userId);

    const msgData = {
      senderId: userId,
      conversationId: currentChat._id,
      text: newMessage,
    };

    // Optimistic message shown immediately
    const optimisticId = `optimistic-${Date.now()}`;
    const optimisticMsg = {
      ...msgData,
      _id: optimisticId,
      sender: { _id: userId },
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimisticMsg]);
    setNewMessage('');

    try {
      // Save to DB first, get back the real saved message
      const res = await axios.post('/api/messages', msgData, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const savedMsg = res.data;

      // ✅ Replace optimistic msg with real DB msg (no refetch = no race condition)
      setMessages(prev => prev.map(m => m._id === optimisticId ? savedMsg : m));

      // ✅ Now emit via socket AFTER save, using the real saved message
      socket.emit('sendMessage', {
        senderId: userId,
        receiverId: receiver._id,
        message: savedMsg, // real msg with _id, sender populated, createdAt
      });

      // Refresh sidebar in background
      axios.get('/api/conversations', {
        headers: { Authorization: `Bearer ${getToken()}` }
      }).then(convRes => setConversations(convRes.data));

    } catch (err) {
      console.error("Send error:", err);
      // Rollback optimistic msg and restore input
      setMessages(prev => prev.filter(m => m._id !== optimisticId));
      setNewMessage(msgData.text);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: "'Syne', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.08); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .empty-state { animation: fadeIn 0.6s ease forwards; }
      `}</style>

      <Sidebar
        conversations={conversations}
        onlineUsers={onlineUsers}
        currentUser={user}
        handleSelectConversation={handleSelectConversation}
        logout={logout}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {currentChat ? (
          <ChatWindow
            currentChat={currentChat}
            messages={messages}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleSendMsg={handleSendMsg}
            scrollRef={scrollRef}
            typing={typing}
          />
        ) : (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(160deg, #faf5ff 0%, #ede9fe 50%, #ddd6fe 100%)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: '-80px', right: '-80px',
              width: '300px', height: '300px', borderRadius: '50%',
              background: 'rgba(167, 139, 250, 0.2)', pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', bottom: '-60px', left: '-60px',
              width: '250px', height: '250px', borderRadius: '50%',
              background: 'rgba(124, 58, 237, 0.12)', pointerEvents: 'none',
            }} />
            <div className="empty-state" style={{ textAlign: 'center', zIndex: 1 }}>
              <div style={{
                width: '90px', height: '90px', borderRadius: '28px',
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px', fontSize: '42px',
                boxShadow: '0 12px 40px rgba(124, 58, 237, 0.35)',
                animation: 'pulse 3s ease-in-out infinite',
              }}>
                💬
              </div>
              <h2 style={{ margin: '0 0 10px', fontSize: '26px', fontWeight: '800', color: '#4c0099', letterSpacing: '-0.5px' }}>
                Welcome to VibeChat
              </h2>
              <p style={{ margin: 0, fontSize: '15px', color: '#a78bfa', fontWeight: '500' }}>
                Select a conversation to start chatting ✨
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;