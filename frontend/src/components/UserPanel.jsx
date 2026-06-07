export default function UserPanel({ users, onlineUsers, onClose }) {
  const isOnline = (userId) =>
    onlineUsers.some(u => u.userId?.toString() === userId?.toString());

  const sorted = [...users].sort((a, b) => {
    const aOnline = isOnline(a._id);
    const bOnline = isOnline(b._id);
    if (aOnline && !bOnline) return -1;
    if (!aOnline && bOnline) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <aside className="user-panel">
      <div className="user-panel-header">
        <h3>Members</h3>
        <button className="icon-btn" onClick={onClose}>✕</button>
      </div>

      <div className="user-panel-section">
        <span className="section-label">Online — {onlineUsers.length}</span>
        {sorted.filter(u => isOnline(u._id)).map(u => (
          <div key={u._id} className="user-item">
            <div className="user-avatar-wrap">
              <div className="avatar" style={{ background: u.color }}>{u.avatar || u.name[0]}</div>
              <span className="online-dot" />
            </div>
            <span className="user-name">{u.name}</span>
          </div>
        ))}
      </div>

      <div className="user-panel-section">
        <span className="section-label">Offline — {sorted.filter(u => !isOnline(u._id)).length}</span>
        {sorted.filter(u => !isOnline(u._id)).map(u => (
          <div key={u._id} className="user-item offline">
            <div className="avatar dim" style={{ background: u.color }}>{u.avatar || u.name[0]}</div>
            <span className="user-name">{u.name}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
