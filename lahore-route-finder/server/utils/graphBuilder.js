/**
 * graphBuilder.js
 *
 * Builds an adjacency list from Route documents fetched from MongoDB.
 *
 * Graph structure (keyed by stop _id string):
 * {
 *   "stopIdA": [
 *     { stopId: "stopIdB", routeId: "...", routeName: "Route 1", weight: 1 },
 *     ...
 *   ],
 *   ...
 * }
 *
 * Each stop is connected to its neighbours along the same route.
 * Connections are bidirectional (undirected graph).
 * Weight = number of stops traversed (used by BFS for fewest-transfers,
 * and haversine distance can be layered in for Dijkstra).
 */

import Route from '../models/Route.js';

/**
 * Load all routes from DB and build an adjacency list.
 * @returns {Promise<Map<string, Array>>} adjacency list keyed by stop _id string
 */
export async function buildGraph() {
  const routes = await Route.find().populate({
    path: 'stops',
    populate: { path: 'locationId' },
  });

  // adjacency list: stopId -> [{ stopId, routeId, routeName, weight }]
  const graph = new Map();

  for (const route of routes) {
    const stops = route.stops;
    for (let i = 0; i < stops.length; i++) {
      const fromId = stops[i]._id.toString();

      if (!graph.has(fromId)) graph.set(fromId, []);

      // Connect each stop to all subsequent stops on the same route (directed forward)
      for (let j = i + 1; j < stops.length; j++) {
        const toId = stops[j]._id.toString();

        if (!graph.has(toId)) graph.set(toId, []);

        // Forward edge (i → j)
        graph.get(fromId).push({
          stopId: toId,
          routeId: route._id.toString(),
          routeName: route.name,
          weight: j - i, // number of intermediate stops + 1
        });

        // Reverse edge (j → i) — bus routes are bidirectional
        graph.get(toId).push({
          stopId: fromId,
          routeId: route._id.toString(),
          routeName: route.name,
          weight: j - i,
        });
      }
    }
  }

  return graph;
}

/**
 * Build a flat map of stopId → stop document (populated with locationId).
 * Useful so search functions can look up stop metadata quickly.
 */
export async function buildStopIndex() {
  const routes = await Route.find().populate({
    path: 'stops',
    populate: { path: 'locationId' },
  });

  const stopIndex = new Map();
  for (const route of routes) {
    for (const stop of route.stops) {
      const id = stop._id.toString();
      if (!stopIndex.has(id)) stopIndex.set(id, stop);
    }
  }
  return stopIndex;
}
