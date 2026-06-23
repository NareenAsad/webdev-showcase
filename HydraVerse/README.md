# HydraVerse - Immersive VR Services Portal

A modern, highly responsive, and premium landing page portal built for **Hydra**, a cutting-edge Virtual Reality development company. The platform showcases VR game development, enterprise simulation services, and technical consulting with a polished, glassmorphic dark-mode design system.

---

## 🚀 Key Features

*   **Responsive Navigation Menu**: High-performance mobile burger menu with smooth scaling and toggles.
*   **Split-Panel Authentication Pages**: Matching, customized **Sign In** and **Sign Up** portals featuring interactive password visibility tools, custom iconography, and decorative gradient spheres.
*   **Immersive Services section**: Overlapping card layout showing VR-specific expertise: *VR Game Development*, *VR Training & Simulation*, and *VR Software Consulting*.
*   **Integrated Contact Portal**: High-contrast, dark-mode contact form showcasing address details, interactive maps text, and bottom-bordered message inputs, utilizing a custom VR backdrop.
*   **Fluid Scrolling Navigation**: Generic scroll handler allowing links (About, Articles, Services, Community, Contact) to scroll smoothly on the landing page or redirect from authentication sub-pages.
*   **Interactive Cards & Community Grid**: Dynamic layout highlighting recent articles and community user listings using Tailwind CSS responsive grids.

---

## 🛠️ Technology Stack

*   **Core:** React (Functional Components, Hooks)
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS (Modern HSL colors, gradient layouts, responsive breakpoints)
*   **Routing:** React Router DOM

---

## 📁 Directory Structure

```text
my-project/
├── src/
│   ├── assets/             # Images & static assets (e.g. services_banner.png)
│   ├── components/         # Reusable React components
│   │   ├── Header.jsx      # Mobile-responsive navigation header
│   │   ├── Hero.jsx        # Landing hero banner
│   │   ├── Services.jsx    # VR Services layout
│   │   ├── Card.jsx        # Article snippet layouts
│   │   ├── Table.jsx       # Community user table
│   │   ├── Contact.jsx     # Brand-themed Contact portal
│   │   ├── SignIn.jsx      # Split-screen Sign-in panel
│   │   ├── SignUp.jsx      # Split-screen Sign-up panel
│   │   └── Footer.jsx      # Responsive brand footer
│   ├── App.jsx             # Main routing & layout controller
│   ├── index.css           # CSS base styles
│   └── main.jsx            # Entry point
```

---

## 💻 Getting Started

### 1. Prerequisites
Ensure you have **Node.js** (v18+) installed.

### 2. Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### 3. Run Development Server
Start the local server with hot-reload support:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser to view the application.

### 4. Build for Production
Bundle the project for production deployment:
```bash
npm run build
```
