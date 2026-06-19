/**
 * routeFinder.js
 *
 * Core route-finding service. Accepts origin & destination (by name or coords),
 * finds nearest stops, runs BFS or Dijkstra, and returns a structured plan.
 *
 * Exported: findRoute(options)
 */

import Stop from '../models/Stop.js';
import { buildGraph, buildStopIndex } from './graphBuilder.js';
import { findNearestStop } from './haversine.js';
import { bfs } from './bfs.js';
import { dijkstra } from './dijkstra.js';

/**
 * Build legs from a raw path array (list of hop objects from BFS/Dijkstra).
 * Groups consecutive hops on the same route into a single "leg".
 *
 * @param {Array}  path       - [ { stopId, routeId, routeName, ... }, ... ]
 * @param {string} sourceId   - starting stop ID (not included in path hops)
 * @param {Map}    stopIndex  - stopId → stop document
 * @returns {Array} legs
 */
function buildLegs(path, sourceId, stopIndex) {
  if (!path || path.length === 0) return [];

  const legs = [];
  let currentLeg = null;
  let prevStopId = sourceId;

  for (const hop of path) {
    if (!currentLeg || currentLeg.routeId !== hop.routeId) {
      // Start a new leg
      if (currentLeg) legs.push(currentLeg);
      const boardStop = stopIndex.get(prevStopId);
      currentLeg = {
        routeId: hop.routeId,
        routeName: hop.routeName,
        board: {
          stopId: prevStopId,
          name: boardStop?.name || prevStopId,
          location: boardStop?.locationId?.name || null,
          coordinates: boardStop?.locationId?.coordinates || null,
        },
        alight: null,
        stops: [],
      };
    }

    const alightStop = stopIndex.get(hop.stopId);
    currentLeg.stops.push({
      stopId: hop.stopId,
      name: alightStop?.name || hop.stopId,
      location: alightStop?.locationId?.name || null,
      coordinates: alightStop?.locationId?.coordinates || null,
    });
    currentLeg.alight = {
      stopId: hop.stopId,
      name: alightStop?.name || hop.stopId,
      location: alightStop?.locationId?.name || null,
      coordinates: alightStop?.locationId?.coordinates || null,
    };

    prevStopId = hop.stopId;
  }

  if (currentLeg) legs.push(currentLeg);

  return legs;
}

/**
 * Main route-finding function.
 *
 * @param {Object} options
 * @param {string} [options.originName]      - name of origin stop (fuzzy matched)
 * @param {string} [options.destinationName] - name of destination stop (fuzzy matched)
 * @param {number} [options.originLat]       - latitude for nearest-stop lookup
 * @param {number} [options.originLng]
 * @param {number} [options.destinationLat]
 * @param {number} [options.destinationLng]
 * @param {'bfs'|'dijkstra'} [options.algorithm='bfs']
 * @returns {Promise<Object>} route plan or error object
 */
export async function findRoute({
  originName,
  destinationName,
  originLat,
  originLng,
  destinationLat,
  destinationLng,
  algorithm = 'bfs',
}) {
  // ── 1. Load all populated stops ──────────────────────────────────────────
  const allStops = await Stop.find().populate('locationId');

  // ── 2. Resolve origin stop ───────────────────────────────────────────────
  let originStop = null;
  if (originName) {
    originStop = allStops.find(
      (s) => s.name.toLowerCase() === originName.toLowerCase()
    );
    // Fallback: partial match
    if (!originStop) {
      originStop = allStops.find((s) =>
        s.name.toLowerCase().includes(originName.toLowerCase())
      );
    }
  } else if (originLat != null && originLng != null) {
    const { stop } = findNearestStop(allStops, originLat, originLng);
    originStop = stop;
  }

  // ── 3. Resolve destination stop ──────────────────────────────────────────
  let destinationStop = null;
  if (destinationName) {
    destinationStop = allStops.find(
      (s) => s.name.toLowerCase() === destinationName.toLowerCase()
    );
    if (!destinationStop) {
      destinationStop = allStops.find((s) =>
        s.name.toLowerCase().includes(destinationName.toLowerCase())
      );
    }
  } else if (destinationLat != null && destinationLng != null) {
    const { stop } = findNearestStop(allStops, destinationLat, destinationLng);
    destinationStop = stop;
  }

  if (!originStop) return { error: `Origin stop not found: "${originName}"` };
  if (!destinationStop) return { error: `Destination stop not found: "${destinationName}"` };

  const sourceId = originStop._id.toString();
  const targetId = destinationStop._id.toString();

  if (sourceId === targetId) {
    return {
      origin: originStop.name,
      destination: destinationStop.name,
      algorithm,
      legs: [],
      message: 'Origin and destination are the same stop.',
    };
  }

  // ── 4. Build graph ───────────────────────────────────────────────────────
  const [graph, stopIndex] = await Promise.all([buildGraph(), buildStopIndex()]);

  // ── 5. Run chosen algorithm ──────────────────────────────────────────────
  let rawPath = null;
  let totalWeight = null;

  if (algorithm === 'dijkstra') {
    const result = dijkstra(graph, sourceId, targetId);
    if (result) {
      rawPath = result.path;
      totalWeight = result.totalWeight;
    }
  } else {
    rawPath = bfs(graph, sourceId, targetId);
  }

  if (!rawPath) {
    return {
      error: 'No route found between the specified stops.',
      origin: originStop.name,
      destination: destinationStop.name,
    };
  }

  // ── 6. Build leg-based plan ──────────────────────────────────────────────
  const legs = buildLegs(rawPath, sourceId, stopIndex);

  return {
    origin: originStop.name,
    destination: destinationStop.name,
    algorithm,
    totalStops: rawPath.length,
    totalWeight,
    transfers: legs.length - 1,
    legs,
  };
}
