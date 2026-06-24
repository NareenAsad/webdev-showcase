# React Prop Drilling & State Management Visualizer

An interactive React visualizer demonstrating the contrast between traditional **Prop Drilling** and **Local State Management (useState)**. Designed with a premium, responsive dark-and-light-ready theme system.

🔗 **Live Demo**: [prop-drilling-state-management.vercel.app](https://prop-drilling-state-management.vercel.app)

---

## 🚀 Features

- **Interactive Tab Navigation**: Easily toggle between the Prop Drilling Flow and State Management demonstrations.
- **Visualized Prop Drilling**: Trace variables (`size`, `width`, `color`) defined in parent Component C1 as they flow downwards through C2 and C3 to reach C4.
- **State Management & Themes**:
  - **Component 1 (State Creator)**: Demonstrates a counter with isolated local state.
  - **Component 2 (Theme Switcher)**: Features local style adjustments (White/Black themes) that adapt to system preferences while keeping structural borders intact.
- **State Persistence**: Uses `localStorage` to save both the user's active tab and theme choice so selections persist across page refreshes.

---

## 🛠️ Tech Stack

- **Framework**: React 18+
- **Build Tool**: Vite
- **Styling**: Vanilla CSS (CSS Variables)

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed.

### Installation

1. Clone or navigate to the repository directory:
   ```bash
   cd Prop-Drilling-State-Management
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.
