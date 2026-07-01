# Users & Articles Database Explorer

An elegant, high-performance React portal designed to explore real-time profile directories, corporate company structures, and interactive article feeds powered by the JSONPlaceholder API. 

This project features a premium, magazine-style editorial user interface built with customized vintage-summer design tokens and responsive typography.

---

## 🔗 Live Demo
Explore the active deployment on Vercel: **[users-posts-explorer.vercel.app](https://users-posts-explorer.vercel.app)**

---

---

## 🎨 Visual Design System & Aesthetics

The interface is styled using a custom HSL-tailored warm vintage palette and elegant typography to deliver a premium user experience:
* **Typography:** Modern pairing of **Playfair Display** (editorial serif headlines) and **Outfit** (clean geometric sans-serif body text).
* **Color Palette:**
  * Canvas Background: `Soft Ivory (#FCF9F2)`
  * Element Backgrounds: `Warm Cream (#FFF3C8)` & `Pure White (#FFFFFF)`
  * Structural Borders: `Soft Gold/Beige (#E5CB90)`
  * Visual Accents: `Vintage Teal (#34A99D)` & `Slate Blue-Gray (#458393)`

---

## ✨ Features

### 1. Dynamic Split-Hero & Stats Dashboard
* Editorial landing split-screen presenting database statistics (`10 Users`, `100 Posts`, `500 Comments`) alongside overlapping visual mockups of user cards and post cards.

### 2. Four-Card Features Grid
* Quick access highlights with decorative hover slide animations:
  * **Verified Profiles:** Explore user contact metrics and mapping coordinates.
  * **Articles Library:** Navigate through text-parsed publication feeds.
  * **Discussion Boards:** Read community feedback on articles.
  * **Mobile Optimized:** Fluid layouts built for any viewport device.

### 3. Integrated User Profiles
* Clean, split-column details cards grouping contact details, company structures, and location vectors.
* Includes a dynamic **Published Articles toggle button** that displays the exact post count and reveals a list of all of their published articles directly at the bottom of the card.
* User list displays at-a-glance post counts for every user.

### 4. Interactive Article Feeds
* Post cards with user details, inline author links, and dynamically calculated reading times.
* Comments threads featuring circular initials-based avatar badges.

### 5. Loading Skeletons & Error Handling
* Custom warm-toned shimmering loading skeletons (`<LoadingSkeleton>`) representing card and detail layouts while fetching data.
* Graceful, custom-styled error containers (`.error-container`) with red-tinted warning boxes and inline SVGs.

### 6. Mobile Responsiveness & 404 Routing
* Fully responsive sticky header containing inline navigation link SVGs that automatically stacks on screens smaller than `768px`.
* Custom 404 Page (`<NotFoundPage>`) mapped to the catch-all wildcard path (`/*`) to handle non-existent URLs visually.

---

## 🛠️ Tech Stack
* **Framework:** React 18+ (Vite)
* **Routing:** React Router v6 (`react-router-dom`)
* **Styling:** Vanilla CSS (cohesive design tokens via variables)
* **API:** Fetch API with JSONPlaceholder REST service

---

## 🚀 Getting Started

### Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### Run Locally (Development)
Start the local Vite server:
```bash
npm run dev
```

### Build for Production
Generate the production bundle:
```bash
npm run build
```
