import { useState } from "react";

export default function Sidebar({
  rooms, activeRoom, onSelectRoom, onJoinRoom, onCreateRoom,
  user, onlineUsers, onLogout, onToggleUsers, showUsers
}) {
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ name: "", icon: "💬", description: "" });
  const [createError, setCreateError] = useState("");
  const [creating, setCreating] = useState(false);

  const isMember = (room) => room.members?.some(m => (m._id || m) === user._id);
  const isOnline = (userId) => onlineUsers.some(u => u.userId?.toString() === userId?.toString());

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setCreateError("");
    try {
      await onCreateRoom(createForm);
      setCreateForm({ name: "", icon: "💬", description: "" });
      setShowCreate(false);
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const EMOJI_OPTIONS = ["💬", "🔥", "🎮", "🎵", "📚", "🚀", "🌍", "💡", "🎨", "⚡"];

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <span className="brand-icon">⚡</span>
        <span className="brand-name">ChatFlow</span>
      </div>

      {/* User info */}
      <div className="sidebar-user">
        <div className="avatar" style={{ background: user.color }}>
          {user.avatar || user.name?.[0]}
        </div>
        <div className="sidebar-user-info">
          <span className="sidebar-username">{user.name}</span>
          <span className="sidebar-status online">● Online</span>
        </div>
        <button className="icon-btn" onClick={onLogout} title="Sign out">⎋</button>
      </div>

      {/* Online count */}
      <div className="sidebar-section-header">
        <span>Rooms</span>
        <button
          className={`icon-btn-sm ${showUsers ? "active" : ""}`}
          onClick={onToggleUsers}
          title="Online users"
        >
          👥 {onlineUsers.length}
        </button>
      </div>

      {/* Rooms list */}
      <div className="rooms-list">
        {rooms.map(room => (
          <button
            key={room._id}
            className={`room-item ${activeRoom?._id === room._id ? "active" : ""} ${!isMember(room) ? "not-member" : ""}`}
            onClick={() => isMember(room) ? onSelectRoom(room) : onJoinRoom(room)}
          >
            <span className="room-icon">{room.icon}</span>
            <div className="room-info">
              <span className="room-name">{room.name}</span>
              <span className="room-meta">{room.members?.length || 0} members</span>
            </div>
            {!isMember(room) && <span className="join-badge">Join</span>}
          </button>
        ))}
      </div>

      {/* Create Room */}
      <div className="sidebar-footer">
        <button className="create-room-btn" onClick={() => setShowCreate(v => !v)}>
          <span>+</span> New Room
        </button>

        {showCreate && (
          <div className="create-room-panel">
            <form onSubmit={handleCreate}>
              <div className="emoji-picker">
                {EMOJI_OPTIONS.map(e => (
                  <button
                    type="button"
                    key={e}
                    className={`emoji-opt ${createForm.icon === e ? "selected" : ""}`}
                    onClick={() => setCreateForm(f => ({ ...f, icon: e }))}
                  >{e}</button>
                ))}
              </div>
              <input
                placeholder="Room name"
                value={createForm.name}
                onChange={ev => setCreateForm(f => ({ ...f, name: ev.target.value }))}
                required
              />
              <input
                placeholder="Description (optional)"
                value={createForm.description}
                onChange={ev => setCreateForm(f => ({ ...f, description: ev.target.value }))}
              />
              {createError && <div className="create-error">{createError}</div>}
              <div className="create-actions">
                <button type="button" onClick={() => setShowCreate(false)}>Cancel</button>
                <button type="submit" disabled={creating} className="primary">
                  {creating ? "Creating…" : "Create"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </aside>
  );
}
