import { useEffect, useRef } from 'react';
import { useChat } from '../hooks/useChat';
import { getCharacter } from '../data/characters';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import './ChatWindow.css';

function ChatWindow({ user, partner }) {
  const { messages, sendMessage, clearChat } = useChat(user, partner);
  const messagesEndRef = useRef(null);
  const partnerChar = getCharacter(partner);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-window" id="chat-window">
      {/* Chat Header */}
      <div className="chat-window__header">
        <div className="chat-window__partner">
          <div className="chat-window__partner-ring">
            <div className="chat-window__partner-ring-inner">
              <span className="chat-window__partner-avatar">{partnerChar.avatar}</span>
            </div>
          </div>
          <div className="chat-window__partner-info">
            <span className="chat-window__partner-name">{partner}</span>
            <span className="chat-window__partner-status">Active now</span>
          </div>
        </div>
        <div className="chat-window__actions">
          <button
            className="chat-window__action-btn"
            onClick={clearChat}
            id="clear-chat-btn"
            title="Clear chat"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
          <button className="chat-window__action-btn" title="Info" id="info-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="chat-window__messages" id="messages-container">
        {messages.length === 0 ? (
          <div className="chat-window__empty">
            <div className="chat-window__empty-avatar-ring">
              <div className="chat-window__empty-avatar-inner">
                <span className="chat-window__empty-avatar">{partnerChar.avatar}</span>
              </div>
            </div>
            <p className="chat-window__empty-name">{partner}</p>
            <p className="chat-window__empty-text">
              Send a message to start chatting with {partner}
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={msg.sender === user}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <ChatInput onSend={sendMessage} partner={partner} />
    </div>
  );
}

export default ChatWindow;
