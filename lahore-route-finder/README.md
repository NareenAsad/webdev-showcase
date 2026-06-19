# Lahore Route Finder

Lahore Route Finder is a Progressive Web App (PWA) designed to help commuters navigate Lahore's public transit network, including the Metrobus, Orange Line Metro Train (OLMT), and Speedo Feeder Bus Routes.

## 🚀 Key Features

- **Multi-modal Route Finder**: Searches paths across Metrobus, Orange Line, and 34 Speedo routes.
- **Dual Algorithms**: BFS for the fewest transfers, and Dijkstra for the shortest path.
- **Offline Mode**: Uses a Workbox PWA service worker and in-browser fallback graph builder to execute searches even when offline.
- **Fare Estimator**: Automatically calculates leg-by-leg fares (PKR 30 flat for Metrobus, PKR 40 flat for Orange Line, PKR 20 base + PKR 5 per stop for Speedo) and displays a detailed breakdown card.
- **Admin Dashboard Portal**: Dedicated CRUD management panel featuring a modern, non-scrolling, sticky side navigation panel and styled grid input forms.
- **Responsive Theme Design**: Sleek dark/light mode toggle with optimized responsive grid containers for devices of all screen sizes.

---

## 🗺️ Data Provenance & Sources

- **Metrobus & Orange Line**: Station lists and alignments are sourced from the official Punjab Masstransit Authority (PMA) network specifications.
- **Speedo Feeder Bus Routes**: Routes 1 through 34 alignments and designations are based on the feeder route schemas published by the Punjab Masstransit Authority.
- **Geocoding Data**: Latitudes and longitudes for transit stops are resolved using OpenStreetMap's Nominatim API, with manual coordinates verification and cached overrides.

---

## 🔄 Interchange Points & Normalization

To allow seamless transfers across different transport networks (e.g. transferring from the Orange Line train to a Speedo bus), the system normalizes stop names (e.g., stripping the trailing `" Station"` suffix) so they resolve to a single shared node in the adjacency graph.

### Core Interchange Points:
1. **Chungi Amar Sidhu** (Metrobus + Speedo Routes 4, 7, 14)
2. **Ghazi Chowk** (Metrobus + Speedo Routes 4, 7, 13, 14, 24 + Orange Line proximity)
3. **Thokar Niaz Baig** (Orange Line + Speedo Routes 21, 22, 23)
4. **Kalma Chowk** (Metrobus + Speedo Routes 8, 11, 13)
5. **Railway Station** (Orange Line + Speedo Routes 1, 3, 9, 16, 17, 25)
6. **Chauburji** (Orange Line + Speedo Routes 6, 9)
7. **Canal / Qaddafi Stadium** (Metrobus + Speedo Routes 8, 10, 17)
8. **Bhatti Chowk** (Metrobus + Speedo Routes 1, 2, 5, 16, 18, 19)
9. **Salamat Pura** (Orange Line + Speedo Route 29)
10. **Azadi Chowk** (Metrobus + Speedo Routes 1, 3, 5)

---

## 🛠️ Tech Stack & Setup

### Requirements:
- Node.js (v18+)
- MongoDB (Running locally or MongoDB Atlas)

### Setup:
1. Clone the repository.
2. In the `server/` directory, create a `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/lahore-route-finder
   JWT_SECRET=your_jwt_secret_key
   ```
3. Run the database seed script:
   ```bash
   cd server
   npm install
   npm run seed
   ```
4. Start the backend:
   ```bash
   npm run dev
   ```
5. Setup and start the frontend:
   ```bash
   cd ../client
   npm install
   npm run dev
   ```
