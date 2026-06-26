import { useState } from 'react';
import './ChatInput.css';

function ChatInput({ onSend, partner }) {
  const [text, setText] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText('');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  function handleHeartSend() {
    onSend('❤️');
  }

  const hasText = text.trim().length > 0;

  return (
    <form
      className="chat-input"
      onSubmit={handleSubmit}
      id="chat-input-form"
    >
      <div className="chat-input__wrapper">
        <input
          type="text"
          className="chat-input__field"
          id="message-input"
          placeholder="Message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          aria-label="Type a message"
        />

        <button
          type="submit"
          className={`chat-input__send-btn ${hasText ? 'chat-input__send-btn--active' : ''}`}
          disabled={!hasText}
          id="send-btn"
          aria-label="Send message"
        >
          <svg className="chat-input__send-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </form>
  );
}

export default ChatInput;
