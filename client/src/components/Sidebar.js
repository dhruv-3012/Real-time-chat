import React from 'react';

const Sidebar = ({ conversations, onlineUsers, currentUser, handleSelectConversation, logout }) => {
  const userId = currentUser._id || currentUser.id;

  return (
    <div style={{
      width: '320px',
      background: 'linear-gradient(160deg, #2d0060 0%, #6a00c8 50%, #a855f7 100%)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      fontFamily: "'Syne', sans-serif",
      boxShadow: '4px 0 30px rgba(168, 85, 247, 0.3)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
        .conv-item { transition: background 0.2s, transform 0.15s; }
        .conv-item:hover { background: rgba(255,255,255,0.12) !important; transform: translateX(4px); }
      `}</style>

      {/* Decorative blobs */}
      <div style={{
        position: 'absolute', top: '-60px', right: '-60px',
        width: '200px', height: '200px', borderRadius: '50%',
        background: 'rgba(255,255,255,0.06)', pointerEvents: 'none',
      }}/>
      <div style={{
        position: 'absolute', bottom: '80px', left: '-40px',
        width: '150px', height: '150px', borderRadius: '50%',
        background: 'rgba(255,255,255,0.04)', pointerEvents: 'none',
      }}/>

      {/* Header */}
      <div style={{
        padding: '28px 24px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.12)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        zIndex: 1,
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '26px', fontWeight: '800', color: '#fff', letterSpacing: '-0.5px' }}>
            Chats
          </h2>
          <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
            {conversations.length} conversations
          </p>
        </div>
        <button
          onClick={logout}
          style={{
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff', padding: '6px 14px', borderRadius: '20px',
            fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: '600',
          }}
          onMouseOver={e => e.target.style.background = 'rgba(255,255,255,0.22)'}
          onMouseOut={e => e.target.style.background = 'rgba(255,255,255,0.12)'}
        >
          Logout
        </button>
      </div>

      {/* Label */}
      <div style={{
        padding: '16px 24px 8px',
        fontSize: '10px', fontWeight: '700', letterSpacing: '2px',
        color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', zIndex: 1,
      }}>
        Recent
      </div>

      {/* Conversation list */}
      <div className="custom-scroll" style={{ flex: 1, overflowY: 'auto', zIndex: 1, paddingBottom: '12px' }}>
        {conversations.map((conv) => {
          const otherUser = conv.members.find(m => m._id !== userId);
          if (!otherUser) return null;
          const isOnline = onlineUsers.includes(otherUser._id);
          const lastMsg = conv.lastMessage;
          const lastMsgText = lastMsg
            ? (lastMsg.sender?._id === userId ? `You: ${lastMsg.text}` : lastMsg.text)
            : 'Start a conversation';
          const lastMsgTime = lastMsg
            ? new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '';

          return (
            <div
              key={conv._id}
              onClick={() => handleSelectConversation(conv)}
              className="conv-item"
              style={{
                display: 'flex', alignItems: 'center',
                padding: '12px 24px', cursor: 'pointer',
                margin: '2px 0', background: 'transparent',
              }}
            >
              {/* Avatar */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <img
                  src={otherUser.profilePicture || `https://ui-avatars.com/api/?name=${otherUser.username}&background=7c3aed&color=fff&size=48`}
                  alt="avatar"
                  style={{
                    width: '50px', height: '50px', borderRadius: '50%',
                    objectFit: 'cover', border: '2px solid rgba(255,255,255,0.25)',
                  }}
                />
                <div style={{
                  position: 'absolute', bottom: '1px', right: '1px',
                  width: '12px', height: '12px', borderRadius: '50%',
                  background: isOnline ? '#4ade80' : 'rgba(255,255,255,0.25)',
                  border: '2px solid #6a00c8',
                }}/>
              </div>

              {/* Info */}
              <div style={{ marginLeft: '14px', flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{
                    margin: 0, fontWeight: '700', fontSize: '15px', color: '#fff',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    maxWidth: '140px',
                  }}>
                    {otherUser.username}
                  </p>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', flexShrink: 0, marginLeft: '8px' }}>
                    {lastMsgTime}
                  </span>
                </div>
                <p style={{
                  margin: '3px 0 0', fontSize: '12px',
                  color: 'rgba(255,255,255,0.45)',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  maxWidth: '180px',
                }}>
                  {lastMsgText}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer glow */}
      <div style={{
        height: '60px',
        background: 'linear-gradient(to top, rgba(45,0,96,0.8), transparent)',
        position: 'absolute', bottom: 0, left: 0, right: 0, pointerEvents: 'none',
      }}/>
    </div>
  );
};

export default Sidebar;