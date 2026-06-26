import './MessageBubble.css';

/**
 * Format a timestamp into a short time string (e.g. "2:35 PM").
 */
function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function MessageBubble({ message, isOwn }) {
  const { text, timestamp, seenBy } = message;
  const seenCount = seenBy.length;

  return (
    <div
      className={`msg ${isOwn ? 'msg--own' : 'msg--other'}`}
      id={`message-${message.id}`}
    >
      <div className={`msg__bubble ${isOwn ? 'msg__bubble--own' : 'msg__bubble--other'}`}>
        <p className="msg__text">{text}</p>
      </div>
      <div className="msg__meta">
        <span className="msg__time">{formatTime(timestamp)}</span>
        <span className="msg__seen" title={`Seen by: ${seenBy.join(', ')}`}>
          <svg className={`msg__seen-icon ${seenCount >= 2 ? 'msg__seen-icon--seen' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span className="msg__seen-count">{seenCount}</span>
        </span>
      </div>
    </div>
  );
}

export default MessageBubble;
