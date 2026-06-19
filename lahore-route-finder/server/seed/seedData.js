import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import Location from '../models/Location.js';
import Stop from '../models/Stop.js';
import Route from '../models/Route.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const CACHE_PATH = path.join(__dirname, 'coordinatesCache.json');

// Load cache if it exists
let coordinatesCache = {};
if (fs.existsSync(CACHE_PATH)) {
  try {
    coordinatesCache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));
    console.log(`Loaded ${Object.keys(coordinatesCache).length} cached coordinates.`);
  } catch (err) {
    console.error('Error reading coordinates cache:', err);
  }
}

// Haversine distance helper for calculating distances between stops
function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// OSM Nominatim resolution with 1 sec delay per new request
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getCoordinates(name) {
  const trimmedName = name.trim();
  if (coordinatesCache[trimmedName]) {
    return coordinatesCache[trimmedName];
  }

  console.log(`Fetching coordinates for "${trimmedName}" from Nominatim API...`);
  // Delay 1 second to comply with Nominatim usage policy
  await sleep(1000);

  const queryName = trimmedName.endsWith('Station') ? trimmedName : `${trimmedName} Station`;
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(queryName)}, Lahore, Pakistan&format=json&limit=1`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'LahoreRouteFinder/1.0 (contact@lahoreroutefinder.org)'
      }
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.length > 0) {
        const coords = {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
        coordinatesCache[trimmedName] = coords;
        // Save cache incrementally
        fs.writeFileSync(CACHE_PATH, JSON.stringify(coordinatesCache, null, 2));
        console.log(`Resolved "${trimmedName}" -> Lat: ${coords.lat}, Lng: ${coords.lng}`);
        return coords;
      }
    }
  } catch (err) {
    console.error(`Network or parse error resolving coordinates for "${trimmedName}":`, err.message);
  }

  // Fallback centered in Lahore with small random offsets so stops don't stack directly
  const fallback = {
    lat: 31.5204 + (Math.random() - 0.5) * 0.08,
    lng: 74.3587 + (Math.random() - 0.5) * 0.08
  };
  console.log(`No results or error. Using fallback for "${trimmedName}" -> Lat: ${fallback.lat.toFixed(4)}, Lng: ${fallback.lng.toFixed(4)}`);
  
  // Cache the fallback so we don't spam the API on failure
  coordinatesCache[trimmedName] = fallback;
  fs.writeFileSync(CACHE_PATH, JSON.stringify(coordinatesCache, null, 2));

  return fallback;
}

// Seed Transit Data Definitions
const metrobusStops = [
  "Gajjumata", "Dulu Khurd", "Youhanabad", "Nishtar Colony", "Atari Saroba", 
  "Kamahan", "Chungi Amar Sidhu", "Ghazi Chowk", "Qainchi", "Ittefaq Hospital", 
  "Naseerabad", "Model Town", "Kalma Chowk", "Qaddafi Stadium", "Canal", 
  "Ichara", "Shama", "Qartaba Chowk", "Janazgah", "Mao College", 
  "Civil Secretariat", "Katchery", "Bhatti Chowk", "Azadi Chowk", "Timber Market", 
  "Niazi Chowk", "Shahdara"
];

const orangeLineStops = [
  "Dera Gujran Station", "Islam Park Station", "Salamat Pura Station", 
  "Mehmood Booti Station", "Pakistan Mint Station", "Shalamar Garden Station", 
  "Baghbanpura Station", "U.E.T. Station", "Sultanpura Station", "Railway Station", 
  "Lakshmi Station", "GPO Station", "Anarkali Station", "Chauburji Station", 
  "Gulshan-e-Ravi Station", "Samanabad Station", "Yateem Khana / Bund Road Station", 
  "Scheme Morr / Salahuddin Road Station", "Shahnoor Station", "Sabzazar Station", 
  "Awan Town Station", "Wahdat Road Station", "Hanjarwal Station", "Canal View Station", 
  "Thokar Niaz Baig Station", "Ali Town Station"
];

const speedoRoutes = [
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
];

async function seed() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is missing');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.');

    // Clean existing data
    console.log('Clearing existing Location, Stop, and Route collections...');
    await Location.deleteMany({});
    await Stop.deleteMany({});
    await Route.deleteMany({});
    console.log('Collections cleared.');

    // 1. Gather all unique stop names
    const cleanName = (name) => name.replace(/\s+Station$/i, '').trim();

    const allStopNames = new Set();
    
    metrobusStops.forEach(name => allStopNames.add(cleanName(name)));
    orangeLineStops.forEach(name => allStopNames.add(cleanName(name)));
    speedoRoutes.forEach(route => {
      route.alignment.forEach(name => allStopNames.add(cleanName(name)));
    });

    const uniqueStopNames = Array.from(allStopNames);
    console.log(`Found ${uniqueStopNames.length} unique stop names.`);

    // 2. Resolve coordinates for each unique stop name
    const locationsData = [];
    for (let i = 0; i < uniqueStopNames.length; i++) {
      const name = uniqueStopNames[i];
      console.log(`[${i + 1}/${uniqueStopNames.length}] Resolving coordinates for: ${name}`);
      const coords = await getCoordinates(name);
      locationsData.push({
        name,
        city: 'Lahore',
        coordinates: coords
      });
    }

    // 3. Insert all Locations
    console.log('Inserting Location documents...');
    const insertedLocations = await Location.insertMany(locationsData);
    console.log(`Inserted ${insertedLocations.length} Location documents.`);

    // Create mapping of name -> Location object
    const locationMap = {};
    insertedLocations.forEach(loc => {
      locationMap[loc.name] = loc;
    });

    // 4. Create all Stops (1:1 mapping with Locations)
    console.log('Creating Stop documents...');
    const stopsData = uniqueStopNames.map(name => {
      const loc = locationMap[name];
      return {
        name,
        locationId: loc._id
      };
    });

    const insertedStops = await Stop.insertMany(stopsData);
    console.log(`Inserted ${insertedStops.length} Stop documents.`);

    // Create mapping of name -> Stop object
    const stopMap = {};
    insertedStops.forEach(stop => {
      stopMap[stop.name] = stop;
    });

    // Helper to calculate total distance of a route and return list of Stop ObjectIds
    function buildRouteStopsAndDistance(names) {
      const stopIds = [];
      let totalDistance = 0;

      for (let i = 0; i < names.length; i++) {
        const stopName = cleanName(names[i]);
        const stopObj = stopMap[stopName];
        if (!stopObj) {
          console.error(`Stop object not found for name: ${stopName}`);
          continue;
        }
        stopIds.push(stopObj._id);

        if (i > 0) {
          const prevStopName = cleanName(names[i - 1]);
          const prevLoc = locationMap[prevStopName];
          const currLoc = locationMap[stopName];
          if (prevLoc && currLoc) {
            totalDistance += haversineDistance(
              prevLoc.coordinates.lat,
              prevLoc.coordinates.lng,
              currLoc.coordinates.lat,
              currLoc.coordinates.lng
            );
          }
        }
      }
      return { stopIds, totalDistance };
    }

    // 5. Construct Routes
    const routesData = [];

    // Metrobus Route
    console.log('Preparing Metrobus Main Route...');
    const mbData = buildRouteStopsAndDistance(metrobusStops);
    routesData.push({
      name: 'Metrobus Main Route',
      stops: mbData.stopIds,
      distance: parseFloat(mbData.totalDistance.toFixed(2)),
      duration: metrobusStops.length * 2 // 2 minutes per stop estimate
    });

    // Orange Line Route
    console.log('Preparing Orange Line Main Route...');
    const olData = buildRouteStopsAndDistance(orangeLineStops);
    routesData.push({
      name: 'Orange Line Main Route',
      stops: olData.stopIds,
      distance: parseFloat(olData.totalDistance.toFixed(2)),
      duration: orangeLineStops.length * 2 // 2 minutes per stop estimate
    });

    // Speedo Routes
    console.log('Preparing 34 Speedo Feeder Bus Routes...');
    speedoRoutes.forEach(route => {
      const spData = buildRouteStopsAndDistance(route.alignment);
      routesData.push({
        name: `Speedo Route ${route.routeNo}`,
        stops: spData.stopIds,
        distance: parseFloat(spData.totalDistance.toFixed(2)),
        duration: route.alignment.length * 3 // 3 minutes per stop estimate due to traffic
      });
    });

    // 6. Insert all Routes
    console.log('Inserting Route documents...');
    const insertedRoutes = await Route.insertMany(routesData);
    console.log(`Inserted ${insertedRoutes.length} Route documents.`);

    console.log('Seeding completed successfully!');
  } catch (err) {
    console.error('Seeding failed with error:', err);
  } finally {
    mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

seed();
