import React, { useState } from 'react';
import { Send, Smile } from 'lucide-react';
import Picker from 'emoji-picker-react';

const ChatWindow = ({ currentChat, messages, newMessage, setNewMessage, handleSendMsg, scrollRef, typing }) => {
  const [showEmoji, setShowEmoji] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user._id || user.id;

  const otherUser = currentChat.members.find(m => m._id !== userId);

  // ✅ FIX: emoji-picker-react v4+ callback is (emojiObject) not (event, emojiObject)
  const onEmojiClick = (emojiObject) => {
    setNewMessage(prev => prev + emojiObject.emoji);
    setShowEmoji(false); // close picker after selecting
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100vh',
      fontFamily: "'Syne', sans-serif", background: '#f3e8ff', position: 'relative',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');
        .msg-scroll::-webkit-scrollbar { width: 4px; }
        .msg-scroll::-webkit-scrollbar-track { background: transparent; }
        .msg-scroll::-webkit-scrollbar-thumb { background: #c084fc; border-radius: 4px; }
        .send-btn {
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          border: none; border-radius: 50%;
          width: 44px; height: 44px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: white;
          box-shadow: 0 4px 15px rgba(124, 58, 237, 0.4);
          transition: all 0.2s; flex-shrink: 0;
        }
        .send-btn:hover { transform: scale(1.08); box-shadow: 0 6px 20px rgba(124, 58, 237, 0.6); }
        .emoji-btn {
          background: none; border: none; cursor: pointer; padding: 8px;
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          transition: background 0.2s; color: #a855f7; flex-shrink: 0;
        }
        .emoji-btn:hover { background: rgba(168, 85, 247, 0.1); }
        .msg-input {
          flex: 1; border: none; background: transparent; outline: none;
          font-size: 15px; font-family: 'Syne', sans-serif; color: #1e0040; padding: 0 12px;
        }
        .msg-input::placeholder { color: #c084fc; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .msg-bubble { animation: fadeUp 0.2s ease; }
      `}</style>

      {/* Header */}
      <div style={{
        padding: '16px 24px',
        background: 'linear-gradient(135deg, #2d0060 0%, #7c3aed 100%)',
        display: 'flex', alignItems: 'center',
        boxShadow: '0 4px 20px rgba(124, 58, 237, 0.3)', zIndex: 10,
      }}>
        <div style={{ position: 'relative' }}>
          <img
            src={otherUser?.profilePicture || `https://ui-avatars.com/api/?name=${otherUser?.username}&background=7c3aed&color=fff&size=48`}
            alt="avatar"
            style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.3)' }}
          />
          <div style={{
            position: 'absolute', bottom: '1px', right: '1px',
            width: '11px', height: '11px', borderRadius: '50%',
            background: '#4ade80', border: '2px solid #7c3aed',
          }}/>
        </div>
        <div style={{ marginLeft: '14px' }}>
          <h3 style={{ margin: 0, color: '#fff', fontWeight: '700', fontSize: '16px' }}>
            {otherUser?.username}
          </h3>
          <p style={{ margin: 0, fontSize: '12px', color: typing ? '#fde68a' : '#c4b5fd', marginTop: '1px' }}>
            {typing ? '✏️ Typing...' : '● Online'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="msg-scroll" style={{
        flex: 1, overflowY: 'auto', padding: '20px 24px',
        display: 'flex', flexDirection: 'column', gap: '8px',
        background: 'linear-gradient(180deg, #faf5ff 0%, #f3e8ff 100%)',
      }}>
        {messages.map((m) => {
          if (!m.sender) return null;
          const isMine = (m.sender._id || m.sender) === userId;

          return (
            <div
              ref={scrollRef}
              key={m._id}
              className="msg-bubble"
              style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}
            >
              <div style={{
                maxWidth: '65%', padding: '10px 16px',
                borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: isMine ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : '#fff',
                color: isMine ? '#fff' : '#1e0040',
                boxShadow: isMine ? '0 4px 15px rgba(124, 58, 237, 0.35)' : '0 2px 10px rgba(0,0,0,0.08)',
                wordBreak: 'break-word',
              }}>
                {m.image && <img src={m.image} alt="sent" style={{ maxWidth: '100%', borderRadius: '8px', marginBottom: '6px' }}/>}
                <p style={{ margin: 0, fontSize: '15px', lineHeight: '1.4' }}>{m.text}</p>
                <p style={{
                  margin: '4px 0 0', fontSize: '11px', textAlign: 'right',
                  color: isMine ? 'rgba(255,255,255,0.6)' : '#a78bfa',
                }}>
                  {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div style={{ padding: '16px 20px', background: '#fff', borderTop: '1px solid #e9d5ff', position: 'relative' }}>
        {showEmoji && (
          <div style={{ position: 'absolute', bottom: '80px', left: '20px', zIndex: 100 }}>
            <Picker onEmojiClick={onEmojiClick} />
          </div>
        )}
        <div style={{
          display: 'flex', alignItems: 'center',
          background: '#faf5ff', border: '2px solid #e9d5ff',
          borderRadius: '25px', padding: '4px 4px 4px 8px',
        }}>
          <button className="emoji-btn" onClick={() => setShowEmoji(!showEmoji)}>
            <Smile size={20} />
          </button>
          <input
            className="msg-input"
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMsg()}
          />
          <button className="send-btn" onClick={handleSendMsg}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;