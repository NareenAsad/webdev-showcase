/**
 * Character definitions for SyncChat.
 * Each character has a unique id, display name, emoji avatar, and accent color.
 */

export const CHARACTERS = [
  { id: 'alice', name: 'Alice', avatar: '👩', color: '#E1306C' },
  { id: 'bob', name: 'Bob', avatar: '👨', color: '#5B51D8' },
  { id: 'charlie', name: 'Charlie', avatar: '🧑‍💻', color: '#F77737' },
  { id: 'diana', name: 'Diana', avatar: '👩‍🎨', color: '#C13584' },
  { id: 'eve', name: 'Eve', avatar: '👩‍🔬', color: '#6C5CE7' },
  { id: 'frank', name: 'Frank', avatar: '🧔', color: '#00B894' },
];

/**
 * Get a character object by name.
 */
export function getCharacter(name) {
  return CHARACTERS.find((c) => c.name === name) || null;
}

/**
 * Generate a localStorage key for a conversation between two users.
 * Alphabetically sorts the names to ensure both tabs use the same key.
 * e.g. getChatKey("Bob", "Alice") => "chat_Alice_Bob"
 */
export function getChatKey(user1, user2) {
  const sorted = [user1, user2].sort();
  return `chat_${sorted[0]}_${sorted[1]}`;
}

/**
 * Get all characters except the given one.
 */
export function getOtherCharacters(currentUserName) {
  return CHARACTERS.filter((c) => c.name !== currentUserName);
}
