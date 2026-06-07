import { useState, useEffect, useRef } from "react";

function formatTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function groupMessages(messages) {
  const groups = [];
  let lastDate = null;
  let lastSenderId = null;

  for (const msg of messages) {
    const date = formatDate(msg.createdAt);
    if (date !== lastDate) {
      groups.push({ type: "date", label: date, id: `date-${msg.createdAt}` });
      lastDate = date;
      lastSenderId = null;
    }
    const isGrouped = lastSenderId === (msg.sender?._id || msg.sender);
    groups.push({ type: "msg", msg, isGrouped });
    lastSenderId = msg.sender?._id || msg.sender;
  }

  return groups;
}

export default function ChatWindow({ room, messages, user, onSend, onTyping, typingUsers }) {
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimerRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleTextChange = (e) => {
    setText(e.target.value);
    if (!isTyping) {
      setIsTyping(true);
      onTyping(true);
    }
    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      setIsTyping(false);
      onTyping(false);
    }, 1500);
  };

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || !room) return;
    onSend(trimmed);
    setText("");
    clearTimeout(typingTimerRef.current);
    setIsTyping(false);
    onTyping(false);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!room) {
    return (
      <div className="chat-empty">
        <div className="chat-empty-content">
          <div className="chat-empty-icon">⚡</div>
          <h2>Welcome to ChatFlow</h2>
          <p>Select a room to start chatting, or join a new one from the sidebar.</p>
        </div>
      </div>
    );
  }

  const grouped = groupMessages(messages);

  return (
    <div className="chat-window">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-left">
          <span className="chat-room-icon">{room.icon}</span>
          <div>
            <h2 className="chat-room-name">{room.name}</h2>
            {room.description && <p className="chat-room-desc">{room.description}</p>}
          </div>
        </div>
        <div className="chat-header-right">
          <span className="member-count">👥 {room.members?.length || 0}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="messages-area">
        {grouped.length === 0 && (
          <div className="messages-empty">
            <span>{room.icon}</span>
            <p>No messages yet — say hello!</p>
          </div>
        )}

        {grouped.map((item, i) => {
          if (item.type === "date") {
            return (
              <div key={item.id} className="date-divider">
                <span>{item.label}</span>
              </div>
            );
          }

          const { msg, isGrouped } = item;
          const isOwn = (msg.sender?._id || msg.sender) === user._id;

          return (
            <div key={msg._id || i} className={`message-row ${isOwn ? "own" : ""} ${isGrouped ? "grouped" : ""}`}>
              {!isOwn && !isGrouped && (
                <div
                  className="msg-avatar"
                  style={{ background: msg.sender?.color || "#7F77DD" }}
                >
                  {msg.sender?.avatar || msg.sender?.name?.[0] || "?"}
                </div>
              )}
              {!isOwn && isGrouped && <div className="msg-avatar-spacer" />}

              <div className="message-content">
                {!isOwn && !isGrouped && (
                  <div className="msg-header">
                    <span className="msg-name" style={{ color: msg.sender?.color }}>
                      {msg.sender?.name}
                    </span>
                    <span className="msg-time">{formatTime(msg.createdAt)}</span>
                  </div>
                )}
                <div className={`msg-bubble ${isOwn ? "own-bubble" : "other-bubble"}`}>
                  {msg.text}
                  {(isGrouped || isOwn) && (
                    <span className="msg-time-inline">{formatTime(msg.createdAt)}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <div className="typing-indicator">
            <div className="typing-dots">
              <span /><span /><span />
            </div>
            <span className="typing-text">
              {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing…
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input-area">
        <div className="chat-input-wrapper">
          <textarea
            ref={textareaRef}
            className="chat-input"
            placeholder={`Message #${room.name}…`}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button
            className={`send-btn ${text.trim() ? "active" : ""}`}
            onClick={handleSend}
            disabled={!text.trim()}
          >
            ↑
          </button>
        </div>
        <p className="input-hint">Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}
