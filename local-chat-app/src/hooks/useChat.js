import { useState, useEffect, useCallback } from 'react';
import { getChatKey } from '../data/characters';

/**
 * Generate a simple unique ID.
 */
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Read messages for a specific conversation from localStorage.
 */
function readMessages(storageKey) {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Write messages for a specific conversation to localStorage.
 */
function writeMessages(storageKey, messages) {
  localStorage.setItem(storageKey, JSON.stringify(messages));
}

/**
 * Mark all messages as seen by `user`.
 * Returns { updated: boolean, messages: array }.
 */
function markSeen(messages, user) {
  let updated = false;
  const result = messages.map((msg) => {
    if (!msg.seenBy.includes(user)) {
      updated = true;
      return { ...msg, seenBy: [...msg.seenBy, user] };
    }
    return msg;
  });
  return { updated, messages: result };
}

/**
 * useChat — custom hook for per-conversation localStorage chat.
 * @param {string} currentUser — e.g. "Alice"
 * @param {string} partner — e.g. "Bob"
 */
export function useChat(currentUser, partner) {
  const [messages, setMessages] = useState([]);
  const storageKey = getChatKey(currentUser, partner);

  // ─── Load & mark seen on mount / when conversation changes ──
  useEffect(() => {
    const stored = readMessages(storageKey);
    const { updated, messages: seen } = markSeen(stored, currentUser);
    setMessages(seen);
    if (updated) {
      writeMessages(storageKey, seen);
    }
  }, [storageKey, currentUser]);

  // ─── Cross-tab sync via storage event ───────────────────────
  useEffect(() => {
    function handleStorage(event) {
      if (event.key !== storageKey) return;

      const incoming = event.newValue ? JSON.parse(event.newValue) : [];
      const { updated, messages: seen } = markSeen(incoming, currentUser);

      setMessages(seen);

      if (updated) {
        writeMessages(storageKey, seen);
      }
    }

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [storageKey, currentUser]);

  // ─── Send a message ─────────────────────────────────────────
  const sendMessage = useCallback(
    (text) => {
      if (!text.trim()) return;

      const newMsg = {
        id: generateId(),
        sender: currentUser,
        text: text.trim(),
        timestamp: Date.now(),
        seenBy: [currentUser],
      };

      setMessages((prev) => {
        const next = [...prev, newMsg];
        writeMessages(storageKey, next);
        return next;
      });
    },
    [currentUser, storageKey]
  );

  // ─── Clear chat ─────────────────────────────────────────────
  const clearChat = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  return { messages, sendMessage, clearChat };
}

/**
 * Get the last message for a specific conversation (for sidebar previews).
 */
export function getLastMessage(user1, user2) {
  const key = getChatKey(user1, user2);
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const msgs = JSON.parse(raw);
    return msgs.length > 0 ? msgs[msgs.length - 1] : null;
  } catch {
    return null;
  }
}

/**
 * Count unread messages in a conversation for a specific user.
 */
export function getUnreadCount(user1, user2, currentUser) {
  const key = getChatKey(user1, user2);
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return 0;
    const msgs = JSON.parse(raw);
    return msgs.filter((m) => !m.seenBy.includes(currentUser)).length;
  } catch {
    return 0;
  }
}
