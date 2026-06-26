# ⚡ SyncChat — Serverless Real-Time Messenger

SyncChat is a serverless, multi-client chat simulation built entirely with **React JS** and **Vite**. It simulates a real-time messaging application across completely different browser windows/tabs using the HTML5 Web Storage API—**without a database, backend, or WebSockets**.

🔗 **Vercel Live Demo:** [syncchat-messenger.vercel.app](https://syncchat-messenger.vercel.app)

---

## 🚀 Key Features

*   **HTML5 Storage Sync:** Sends and displays messages instantly across different tabs/windows using the browser's native `storage` event emitter.
*   **Unique Message Seen Counters:** Tracks how many times and exactly *who* has viewed each message. The status dynamically changes to an eye icon with a numeric count (e.g., `👁️ 2`) and highlights in blue once seen by the recipient.
*   **6 Interactive Profiles:** Sandbox includes 6 ready-made profiles (Alice, Bob, Charlie, Diana, Eve, Frank) with customized accent themes, avatars, and status glows.
*   **Instagram DM Redesign:** Sleek dark-mode aesthetic with custom sidebar conversation previews, unread badges, gradient bubble message threads, and a clean reactive input field.
*   **High-End Landing Page:** Premium introductory dashboard with neon blurred backdrop glows, center-aligned feature explanation grids, and smooth transitions.

---

## 🛠️ How It Works (Technical Implementation)

### 1. Real-Time Syncing (No WebSockets)
To achieve instant delivery across multiple tabs without a backend server:
*   We listen to the global browser `storage` event inside [useChat.js](file:///src/hooks/useChat.js).
*   When a user sends a message in Tab 1, it writes the new message list to `localStorage` under a unique sorted conversation key.
*   Tab 2 detects the change via the `storage` event, parsing the incoming message list and instantly updating the React state to render the bubble.

### 2. Independent Conversation Keys
To prevent messages from leaking between unrelated characters, conversation keys are derived dynamically by sorting their names alphabetically:
```javascript
export function getChatKey(user1, user2) {
  const sorted = [user1, user2].sort();
  return `chat_${sorted[0]}_${sorted[1]}`; // e.g. "chat_Alice_Bob"
}
```

### 3. Unique Seen Tracking Protocol
To track read messages accurately and prevent a single user from inflating seen counts by repeatedly opening a tab:
*   Each message is initialized with a `seenBy` array containing the sender's username: `seenBy: [currentUser]`.
*   When a recipient opens the chat or receives a new message, the hook appends their username if it isn't already present:
```javascript
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
```
*   The total count is derived dynamically using `seenBy.length` and rendered inside the bubble container.

### 4. Dynamic Height & Scroll Locking
To keep the chat shell feeling like a native desktop app:
*   When logged out (viewing landing/selection pages), the shell wraps in `.app--logged-out`, letting the document stretch and scroll naturally on smaller viewports.
*   When logged in, `.app--logged-in` locks the viewport to exactly `100vh` and restricts overflow, keeping scroll bars isolated strictly inside the chat container and conversation sidebar.

---

## 💻 Local Development Setup

To run SyncChat locally:

1.  **Clone the directory:**
    ```bash
    cd local-chat-app
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the local development server:**
    ```bash
    npm run dev
    ```
4.  Open the local address in two separate browser windows (or one incognito window) to test tab sync:
    *   Window 1: Login as **Alice** and select **Bob**.
    *   Window 2: Login as **Bob** and select **Alice**.

---

## 📦 Deploying to Vercel

You can deploy this project to Vercel in seconds:

### Method 1: Using the Vercel CLI
1.  Install Vercel globally:
    ```bash
    npm install -g vercel
    ```
2.  Run the deployment command:
    ```bash
    vercel
    ```
3.  Follow the prompts to link the project and deploy.

### Method 2: Import via GitHub (Recommended)
1.  Commit and push your project to a GitHub repository.
2.  Log in to [Vercel](https://vercel.com/) and click **Add New** > **Project**.
3.  Select your repository and click **Deploy**. Vercel will automatically detect Vite, configure the build commands, and publish a live URL.
