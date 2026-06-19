# Lahore Route Finder — Implementation Plan

> Give this whole file to your coding agent (Antigravity, Cursor, Claude Code, etc.) as the working brief. It contains the project spec, the data model, **real seed data** for all three transport systems, the routing algorithm design, and a phased build plan with done-criteria for each phase. Work phase by phase, in order, and don't start a phase until the previous one's "Definition of Done" is satisfied.

---

## 1. Project Summary

Build **Lahore Route Finder**, a full-stack MERN (MongoDB, Express, React, Node) web app that helps someone in Lahore enter a starting point and a destination and get back step-by-step public transport directions using:

1. **Metrobus (MBS)** — the red BRT line, Gajjumata ↔ Shahdara.
2. **Orange Line (LRMTS)** — the elevated/at-grade train, Dera Gujran ↔ Ali Town.
3. **Speedo feeder buses** — ~34 mini/standard bus routes that connect neighborhoods to the two main lines.

The app must run fully offline after first load (cached route data + PWA), support an admin CRUD dashboard for managing the transport data, and use JWT auth with `user` / `admin` roles.

This document is the source of truth for data — do not invent station names or coordinates. Where data is genuinely unknown (e.g., precise lat/long), placeholders are marked `null` with a TODO and a suggested way to fill them in.

---

## 2. Tech Stack

**Frontend:** React.js, React Router, Redux Toolkit, Tailwind CSS, React Leaflet + OpenStreetMap tiles, Axios, Workbox (PWA/service worker)

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT (jsonwebtoken + bcrypt), express-validator

**Algorithms:** Plain JS graph BFS (primary) + Dijkstra (optional, for weighted/shortest-time routing)

---

## 3. Folder Structure

```text
lahore-route-finder/
├── client/
│   ├── public/
│   │   ├── manifest.json
│   │   └── service-worker.js
│   └── src/
│       ├── pages/            # Home, Search, Result, MapView, AdminDashboard, Login, Register
│       ├── components/       # SearchForm, RouteCard, StepList, TransportIcon, MapMarkers, AutocompleteInput
│       ├── services/         # api.js (axios instance), routeService.js, authService.js
│       ├── redux/            # store.js, slices/ (authSlice, routeSlice, adminSlice)
│       ├── hooks/            # useDebounce, useOfflineCache
│       └── utils/            # haversine.js, formatSteps.js
├── server/
│   ├── controllers/          # locationController, stopController, routeController, authController
│   ├── models/                # Location.js, Stop.js, Route.js, User.js
│   ├── routes/                 # api.js per resource
│   ├── middleware/             # auth.js (JWT verify), role.js (admin guard), errorHandler.js
│   ├── services/               # routeFinder.js (calls algorithms)
│   ├── algorithms/
│   │   ├── graphBuilder.js     # builds adjacency list from Route documents
│   │   ├── bfs.js
│   │   └── dijkstra.js
│   ├── seed/
│   │   └── seedData.js         # imports the JSON in section 5 and inserts into MongoDB
│   └── config/                 # db.js, env.js
└── README.md
```

---

## 4. Data Model

### 4.1 Location (searchable places: areas, landmarks, universities, hospitals, markets)

```json
{
  "_id": "ObjectId",
  "name": "Thokar Niaz Baig",
  "type": "landmark | area | university | hospital | market",
  "latitude": 31.4,
  "longitude": 74.2,
  "nearestStops": ["ObjectId(Stop)"]
}
```

### 4.2 Stop / Station

```json
{
  "_id": "ObjectId",
  "name": "Ali Town Station",
  "type": "metrobus | orange_line | speedo",
  "code": "OL-26",
  "latitude": 31.5,
  "longitude": 74.3
}
```

### 4.3 Route

```json
{
  "_id": "ObjectId",
  "transportType": "metrobus | orange_line | speedo",
  "routeName": "Metrobus Main Route",
  "routeNo": "1",
  "busType": "standard | mini | n/a",
  "stops": ["Gajjumata", "Dulu Khurd", "..."]
}
```

The route-finding graph is built by chaining consecutive entries in each `stops` array as edges, plus manually-flagged **interchange edges** wherever a Metrobus/Orange Line/Speedo stop is geographically the same physical location (e.g., "Chungi Amar Sidhu" appears on both Metrobus and several Speedo routes — that's a transfer point).

---

## 5. Seed Data (real, extracted from your route maps)

> Coordinates are left `null` where not visually confirmable from the maps you provided. **TODO for the agent:** write a one-time script using the free OSM Nominatim endpoint (`https://nominatim.openstreetmap.org/search?q=<name>, Lahore, Pakistan&format=json`) to backfill lat/long for every stop and location, rate-limited to 1 request/sec per Nominatim's usage policy. Spot-check a few results manually since station names can be ambiguous.

### 5.1 Metrobus (MBS) — Gajjumata ↔ Shahdara, 27 stations

```json
[
  { "code": "MBS-27", "name": "Gajjumata" },
  { "code": "MBS-26", "name": "Dulu Khurd" },
  { "code": "MBS-25", "name": "Youhanabad" },
  { "code": "MBS-24", "name": "Nishtar Colony" },
  { "code": "MBS-23", "name": "Atari Saroba" },
  { "code": "MBS-22", "name": "Kamahan" },
  { "code": "MBS-21", "name": "Chungi Amar Sidhu" },
  { "code": "MBS-20", "name": "Ghazi Chowk" },
  { "code": "MBS-19", "name": "Qainchi" },
  { "code": "MBS-18", "name": "Ittefaq Hospital" },
  { "code": "MBS-17", "name": "Naseerabad" },
  { "code": "MBS-16", "name": "Model Town" },
  { "code": "MBS-15", "name": "Kalma Chowk" },
  { "code": "MBS-14", "name": "Qaddafi Stadium" },
  { "code": "MBS-13", "name": "Canal" },
  { "code": "MBS-12", "name": "Ichara" },
  { "code": "MBS-11", "name": "Shama" },
  { "code": "MBS-10", "name": "Qartaba Chowk" },
  { "code": "MBS-09", "name": "Janazgah" },
  { "code": "MBS-08", "name": "Mao College" },
  { "code": "MBS-07", "name": "Civil Secretariat" },
  { "code": "MBS-06", "name": "Katchery" },
  { "code": "MBS-05", "name": "Bhatti Chowk" },
  { "code": "MBS-04", "name": "Azadi Chowk" },
  { "code": "MBS-03", "name": "Timber Market" },
  { "code": "MBS-02", "name": "Niazi Chowk" },
  { "code": "MBS-01", "name": "Shahdara" }
]
```

This is a single linear route — `routeName: "Metrobus Main Route"`, `stops` = the `name` array above in order (Gajjumata → Shahdara, and reversible).

### 5.2 Orange Line (LRMTS) — Dera Gujran ↔ Ali Town, 26 stations

```json
[
  { "code": "OL-01", "name": "Dera Gujran Station" },
  { "code": "OL-02", "name": "Islam Park Station" },
  { "code": "OL-03", "name": "Salamat Pura Station" },
  { "code": "OL-04", "name": "Mehmood Booti Station" },
  { "code": "OL-05", "name": "Pakistan Mint Station" },
  { "code": "OL-06", "name": "Shalamar Garden Station" },
  { "code": "OL-07", "name": "Baghbanpura Station" },
  { "code": "OL-08", "name": "U.E.T. Station" },
  { "code": "OL-09", "name": "Sultanpura Station" },
  { "code": "OL-10", "name": "Railway Station" },
  { "code": "OL-11", "name": "Lakshmi Station" },
  { "code": "OL-12", "name": "GPO Station" },
  { "code": "OL-13", "name": "Anarkali Station" },
  { "code": "OL-14", "name": "Chauburji Station" },
  { "code": "OL-15", "name": "Gulshan-e-Ravi Station" },
  { "code": "OL-16", "name": "Samanabad Station" },
  { "code": "OL-17", "name": "Yateem Khana / Bund Road Station" },
  { "code": "OL-18", "name": "Scheme Morr / Salahuddin Road Station" },
  { "code": "OL-19", "name": "Shahnoor Station" },
  { "code": "OL-20", "name": "Sabzazar Station" },
  { "code": "OL-21", "name": "Awan Town Station" },
  { "code": "OL-22", "name": "Wahdat Road Station" },
  { "code": "OL-23", "name": "Hanjarwal Station" },
  { "code": "OL-24", "name": "Canal View Station" },
  { "code": "OL-25", "name": "Thokar Niaz Baig Station" },
  { "code": "OL-26", "name": "Ali Town Station" }
]
```

This is a single linear route — `routeName: "Orange Line Main Route"`, `stops` = the `name` array above in order, reversible.

### 5.3 Speedo feeder buses — 34 routes

Each entry is `routeNo`, `from`, `to`, `busType`, and the ordered `alignment` (the waypoint/stop sequence — use this directly as the `stops` array for that Route document).

```json
[
  { "routeNo": "1",  "from": "Railway Station", "to": "Bhatti Chowk", "busType": "standard",
    "alignment": ["Railway Station","Ek Moriya","Nawaz Sharif Hospital","Kashmiri Gate","Lari Adda","Azadi Chowk","Texali Chowk","Bhatti Chowk"] },
  { "routeNo": "2",  "from": "Samanabad Mor", "to": "Bhatti Chowk", "busType": "standard",
    "alignment": ["Samanabad Morr","Corporation Chowk","Taj Company","Sanda","Double Sarkan","Moon Market","Ganda Nala","Bhatti Chowk"] },
  { "routeNo": "3",  "from": "Railway Station", "to": "Shahdara Lari Adda", "busType": "standard",
    "alignment": ["Railway Station","Ek Moriya","Nawaz Sharif Hospital","Kashmiri Gate","Lari Adda","Azadi Chowk","Timber Market","Metro","Niazi Chowk","Shahdara Metro Station","Shahdara Lari Adda"] },
  { "routeNo": "4",  "from": "R.A. Bazar", "to": "Chungi Amar Sidhu", "busType": "standard",
    "alignment": ["R.A Bazar","Nadeem Chowk","Defence Morr","Shareef Market","Walton","Qainchi","Ghazi Chowk","Chungi Amar Sidhu"] },
  { "routeNo": "5",  "from": "Shad Bagh Underpass", "to": "Bhatti Chowk", "busType": "mini",
    "alignment": ["Shad Bagh Underpass","Rajput Park","Madina Chowk","Lohay Wali Pulley","Badami Bagh","Lari Adda Gol Chakar","Azadi Chowk","Taxali Chowk","Bhatti Chowk"] },
  { "routeNo": "6",  "from": "Babu Sabu", "to": "Raj Garh Chowk", "busType": "mini",
    "alignment": ["Babu Sabu","Niazi Adda","City Bus Stand","Chowk Yateem Khana","Bhala Stop","Samanabad Morr","Chauburji","Riwaz Garden","M.A.O College","Firdous Cinema","Raj Garh Chowk"] },
  { "routeNo": "7",  "from": "Bagrian", "to": "Chungi Amar Sidhu", "busType": "standard",
    "alignment": ["Bagrian","Depot Chowk","Minhaj University","Hamdard Chowk","Rehmat Eye Hospital","Pindi Stop","Peco Morr","Kot Lakhpat Railway Station","Phatak Mandi","Qainchi","Ghazi Chowk","Chungi Amar Sidhu"] },
  { "routeNo": "8",  "from": "Doctor Hospital", "to": "Canal", "busType": "standard",
    "alignment": ["Doctor Hospital","Wafaqi Colony","IBA Stop","Hailey College","Campus Pull","Barkat Market","Kalma Chowk","Qaddafi Stadium","Canal"] },
  { "routeNo": "9",  "from": "Railway Station", "to": "Sham Nagar", "busType": "mini",
    "alignment": ["Railway Station","Haji Camp","Shimla Pahari","Lahore Zoo","Chairing Cross","Ganga Ram Hospital","Qartaba Chowk","Chauburji","Sham Nagar"] },
  { "routeNo": "10", "from": "Multan Chungi", "to": "Qartaba Chowk", "busType": "standard",
    "alignment": ["Multan Chungi","Mustafa Town","Karim Block Market","PU Examination Center","Bhekewal Morr","Wahdat Colony","Naqsha Stop","Canal","Ichra","Shama","Qartaba Chowk"] },
  { "routeNo": "11", "from": "Babu Sabu", "to": "Main Market Gulberg", "busType": "standard",
    "alignment": ["Babu Sabu","Niazi Adda","City Bus Stand","Chowk Yateem Khana","Scheme Morr","Flat Stop","Dubai Chowk","Bhekewal Morr","Sheikh Zaid Hospital","Campus Pull","Barkat Market","Kalma Chowk","Liberty Chowk","Hafeez Center","Mini Market","Main Market Gulberg"] },
  { "routeNo": "12", "from": "R.A Bazar", "to": "Civil Secretariat", "busType": "standard",
    "alignment": ["R.A Bazar","PAF Market","Girja Chowk","Afshan Chowk","Fortress Stadium","Gymkhana","Aitchison College","PC Hotel","Lahore Zoo","Chairing Cross","GPO","Anarkali","Civil Secretariat"] },
  { "routeNo": "13", "from": "Bagrian", "to": "Kalma Chowk", "busType": "standard",
    "alignment": ["Bagrian","Ghazi Chowk","UMT Stop","Khokhar Chowk","Akbar Chowk","Pindi Stop","Peco Morr","Phatak Mandi","Ittefaq Hospital","Model Town","Kalma Chowk"] },
  { "routeNo": "14", "from": "R.A Bazar", "to": "Chungi Amar Sidhu", "busType": "standard",
    "alignment": ["R.A Bazar","Fauji Foundation","Ali View Garden","Bhatta Chowk","DHA Nursery","LESCO","Chota Ishara Stop","Naka Stop","Ghazi Chowk","Chungi Amar Sidhu"] },
  { "routeNo": "15", "from": "Qartba Chowk", "to": "Babu Sabu", "busType": "mini",
    "alignment": ["Qartba Chowk","Hakeem M. Ajmal Khan Road","Gulshan Ravi Road","Kacha Ferozepur Road","Babu Sabu"] },
  { "routeNo": "16", "from": "Railway Station", "to": "Bhatti Chowk", "busType": "mini",
    "alignment": ["Railway Station","Circular Road","Ek Moriya","Bhatti Chowk"] },
  { "routeNo": "17", "from": "Canal", "to": "Railway Station", "busType": "standard",
    "alignment": ["Canal","Main Boulevard Shadman","Davis Road","Shimla Pahari","Haji Camp","Railway Station"] },
  { "routeNo": "18", "from": "Bhatti Chowk", "to": "Shimla Pahari", "busType": "mini",
    "alignment": ["Bhatti Chowk","Circular Road","Nisbat Road","Abbot Road","Shimla Pahari"] },
  { "routeNo": "19", "from": "Main Market", "to": "Bhatti Chowk", "busType": "mini",
    "alignment": ["Main Market","Jail Road","Lytton Road","Crust Road","Lower Mall Road","Bhatti Chowk"] },
  { "routeNo": "20", "from": "Jain Mandar", "to": "Chowk Yateem Khana", "busType": "mini",
    "alignment": ["Jain Mandar","Al-Mumtaz Road","Poonch Road","Lake Road","Chowk Yateem Khana"] },
  { "routeNo": "21", "from": "Depot Chowk", "to": "Thokar Niaz Baig", "busType": "standard",
    "alignment": ["Depot Chowk","Madar-e-Millat Road","Ali Road","Baig Road","Canal Bank Road","Thokar Niaz Baig"] },
  { "routeNo": "22", "from": "Depot Chowk", "to": "Thokar Niaz Baig", "busType": "standard",
    "alignment": ["Depot Chowk","Madar-e-Millat Road","Sutlej Avenue","Shahrah Nazria-e-Pakistan Avenue","Thokar Niaz Baig"] },
  { "routeNo": "23", "from": "Valencia", "to": "Thokar Niaz Baig", "busType": "mini",
    "alignment": ["Valencia","Valencia Main Boulevard","Khayaban-e-Jinnah","Raiwind Road","Thokar Niaz Baig"] },
  { "routeNo": "24", "from": "Multan Chungi", "to": "Ghazi Chowk", "busType": "standard",
    "alignment": ["Multan Chungi","College Road","Maulana Shaukat Ali Road","Wahdat Road","Ghazi Chowk"] },
  { "routeNo": "25", "from": "R.A Bazar", "to": "Railway Station", "busType": "standard",
    "alignment": ["R.A Bazar","Lahore-Bedian Road","Allama Iqbal Road","Railway Station"] },
  { "routeNo": "26", "from": "R.A Bazar", "to": "Daroghawala", "busType": "standard",
    "alignment": ["R.A Bazar","G.T Road","Shalimar Link Road","Tufail Road","Sarfraz Rafique Road","Daroghawala"] },
  { "routeNo": "27", "from": "BataPur", "to": "Daroghawala", "busType": "mini",
    "alignment": ["BataPur","GT Road","Daroghawala"] },
  { "routeNo": "28", "from": "Quaid e Azam Interchange", "to": "Airport", "busType": "mini",
    "alignment": ["Quaid e Azam Interchange","Harbanspura Road","Zarar Shaheed Road","Airport"] },
  { "routeNo": "29", "from": "Niazi Interchange", "to": "Salamat Pura", "busType": "standard",
    "alignment": ["Niazi Interchange","Lahore Ring Road","Band Road","Sue Wala Road","Salamat Pura"] },
  { "routeNo": "30", "from": "Daroghawala", "to": "Airport", "busType": "standard",
    "alignment": ["Daroghawala","G.T. Road","Shalimar Link Road","Airport"] },
  { "routeNo": "31", "from": "Daroghawala", "to": "Lari Adda", "busType": "mini",
    "alignment": ["Daroghawala","Chamra Mandi","Cooper Store","UET","Shalimar Chowk","Lari Adda"] },
  { "routeNo": "32", "from": "Shimla Pahari", "to": "Ek Moriya", "busType": "mini",
    "alignment": ["Shimla Pahari","Durand Road","Queen Mary Road","Garhi Shahu Bridge","Cooper Store","Chamra Mandi","Ek Moriya"] },
  { "routeNo": "33", "from": "Cooper Store", "to": "Mughalpura", "busType": "mini",
    "alignment": ["Cooper Store","Workshop Road","Mughalpura Road","Mughalpura"] },
  { "routeNo": "34", "from": "Singhpura", "to": "Mughalpura", "busType": "mini",
    "alignment": ["Singhpura","Wheatman Road","Griffin Road","Mughalpura"] }
]
```

**Note on Speedo fares/schedule** (useful for the "fare estimation" optional feature): fares range roughly PKR 20–80 by distance with smart-card support; buses run daily 6 AM–10 PM at ~5–10 minute intervals. These are general parameters, not per-route exact figures — treat them as defaults in the fare-estimator, not ground truth per route.

### 5.4 Known interchange points (manually flag these as transfer edges between transport types)

These names recur across systems and represent real-world transfer points — when building the graph, treat the same-named stop appearing in two different `transportType` routes as a single graph node with a "walk/transfer" edge of small weight (e.g., 2–5 min) between them, rather than two disconnected nodes:

- Chungi Amar Sidhu (Metrobus + Speedo Routes 4, 7, 14)
- Ghazi Chowk (Metrobus + Speedo Routes 4, 7, 13, 14, 24 + Orange Line proximity)
- Thokar Niaz Baig (Orange Line + Speedo Routes 21, 22, 23)
- Kalma Chowk (Metrobus + Speedo Routes 8, 11, 13)
- Railway Station (Orange Line + Speedo Routes 1, 3, 9, 16, 17, 25)
- Chauburji (Orange Line + Speedo Routes 6, 9)
- Canal / Qaddafi Stadium (Metrobus + Speedo Routes 8, 10, 17)
- Bhatti Chowk (Metrobus + Speedo Routes 1, 2, 5, 16, 18, 19)
- Salamat Pura (Orange Line + Speedo Route 29)
- Azadi Chowk (Metrobus + Speedo Routes 1, 3, 5)

This list is not exhaustive — when seeding, do a fuzzy-name match across all `Stop` documents and flag any exact or near-exact name matches across different `transportType`s as candidate interchanges, then have a human spot-check the list before committing it.

---

## 6. Route-Finding Algorithm

1. **Graph build** (`graphBuilder.js`): on server start (or on a cache-refresh trigger), load all `Route` documents, and for each one add an edge between every consecutive pair of stops in its `stops` array (bidirectional, since both lines/buses run both directions). Add the manual interchange edges from §5.4.
2. **Nearest-stop lookup**: given a user's free-text location, resolve it to a `Location` via the autocomplete, then find the nearest `Stop` by haversine distance (`utils/haversine.js`). Do the same for the destination.
3. **Same-route check**: if start-stop and end-stop appear in the same `Route.stops` array, the trip is direct — return that single leg.
4. **BFS** (`bfs.js`): if not on the same route, run BFS over the full graph (unweighted, fewest hops = fewest transfers) from start-stop to end-stop. This is the default "best route" because most users care more about minimizing transfers than shaving a few minutes.
5. **Dijkstra** (`dijkstra.js`, optional toggle): same graph but edge-weighted by estimated travel time between consecutive stops (can default to a flat per-hop time, e.g., 3 min/stop, until better data exists), for a "fastest route" option.
6. **Step formatting**: convert the resulting path (sequence of stops + which route/transport type connects each pair) into human-readable steps, e.g.: *"Walk to Gajjumata Metrobus Station → Ride Metrobus toward Shahdara → Alight at Kalma Chowk → Walk to destination."* Insert a "Walk Xm to/from station" step using the haversine distance from §6.2 wherever the path starts/ends at a stop rather than the exact location.

---

## 7. API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me                (protected)

GET    /api/locations?search=      (autocomplete; protected: none)
POST   /api/locations              (admin only)
PUT    /api/locations/:id          (admin only)
DELETE /api/locations/:id          (admin only)

GET    /api/stops
POST   /api/stops                  (admin only)
PUT    /api/stops/:id              (admin only)
DELETE /api/stops/:id              (admin only)

GET    /api/routes
POST   /api/routes                 (admin only)
PUT    /api/routes/:id             (admin only)
DELETE /api/routes/:id             (admin only)

POST   /api/route-finder/search    body: { fromLocationId, toLocationId, mode: "fewest-transfers" | "fastest" }
```

---

## 8. Frontend Pages

1. **Home** — hero, "Find a route" CTA, brief explainer of the three transport types.
2. **Route Search** — two autocomplete inputs (current location, destination) wired to `GET /api/locations?search=`, debounced.
3. **Route Result** — step list (icons per transport type: bus/train), total walk distance, estimated time.
4. **Map View** — React Leaflet map showing start marker, destination marker, and the route path overlaid on OSM tiles, color-coded per transport type (reuse the legend colors from the official maps: Metrobus = green line, Orange Line = orange line).
5. **Admin Dashboard** — tabs for Locations / Stops / Routes, table + modal forms for CRUD, guarded by `role.js` middleware and a frontend route guard.
6. **Login / Register** — JWT auth forms, store token in memory + httpOnly-cookie pattern (avoid localStorage for the token itself if you want to harden against XSS).

---

## 9. Offline / PWA

- Register a service worker (Workbox) that caches the app shell and the `/api/stops`, `/api/routes`, `/api/locations` GET responses on first successful fetch.
- On subsequent loads with no network, serve cached data and run the BFS/Dijkstra entirely client-side using the cached graph (you'll need a lightweight client-side copy of `graphBuilder.js` + `bfs.js`, since there's no server to hit offline).
- Add `manifest.json` for installability (name, icons, theme color — use Metrobus red `#E2231A` or Orange Line orange `#F5821F` as the theme).

---

## 10. Phased Build Plan (do these in order)

**Phase 0 — Scaffold**
Initialize `client/` (Vite + React + Tailwind) and `server/` (Express + Mongoose). Set up `.env`, MongoDB connection, CORS, and a health-check route. *Done when:* `npm run dev` on both sides serves a blank page and `GET /api/health` returns 200.

**Phase 1 — Data layer**
Create the `Location`, `Stop`, `Route`, `User` Mongoose models from §4. Write `seed/seedData.js` using the JSON from §5 and run it. *Done when:* the DB has 27 Metrobus stops, 26 Orange Line stops, 34 Speedo routes with their alignments, and the Metrobus/Orange Line main routes, all queryable via Mongo shell or Compass.

**Phase 2 — Auth**
Implement register/login/JWT middleware/role middleware. *Done when:* a `user` and an `admin` account can both log in and `admin`-only routes correctly 403 for `user`.

**Phase 3 — Core CRUD APIs**
Build the Location/Stop/Route REST endpoints with validation. *Done when:* Postman/Thunder Client can fully CRUD all three resources with admin auth.

**Phase 4 — Routing engine**
Implement `graphBuilder.js`, `bfs.js`, `dijkstra.js`, the nearest-stop haversine lookup, and `routeFinder.js`, wired to `POST /api/route-finder/search`. *Done when:* searching "Gajjumata" → "Thokar Niaz Baig" returns a multi-leg plan that correctly chains Metrobus + a transfer + Orange Line (or Speedo) using real interchange points from §5.4.

**Phase 5 — Frontend core**
Build Home, Search (with autocomplete), Result, and the Redux slices/services to call the API. *Done when:* a user can type two locations, submit, and see formatted steps on screen.

**Phase 6 — Map**
Add React Leaflet map view rendering markers + route polyline. *Done when:* Route Result page shows the path on a real Lahore map matching the step list.

**Phase 7 — Admin dashboard**
Build the protected admin pages with CRUD tables/forms hitting Phase 3's APIs. *Done when:* an admin can add a new Speedo route through the UI and immediately see it affect search results.

**Phase 8 — Offline/PWA**
Add service worker, manifest, and client-side fallback routing. *Done when:* after one successful load, going to airplane mode and refreshing still lets you search a route between two cached stops.

**Phase 9 — Polish**
Dark/light mode, responsive pass, transport icons, loading/error states. Optional: fare estimator (use the §5.3 fare note as defaults), Urdu labels, voice search.

---

## 11. Open Items / Assumptions for the Agent to Flag Back

- Exact lat/long for every stop and location is not yet filled in — see the Nominatim TODO in §5.
- Interchange list in §5.4 is a best-effort manual pass over the two official maps and the Speedo route list; it is not an authoritative PMTA dataset. Treat it as a seed and let the admin dashboard correct it over time.
- Speedo route alignments are mid-2025 community-sourced data (a forum post citing PMTA), not an official PMTA API — note this in the README as a data-provenance caveat, and design the admin CRUD so route data is easy to correct without redeploying code.
