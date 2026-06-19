/**
 * bfs.js — Fewest-transfers route search using Breadth-First Search.
 *
 * Returns the path with the fewest number of stops (and route changes)
 * between a source stop and a destination stop.
 *
 * @param {Map}    graph     - adjacency list from graphBuilder.buildGraph()
 * @param {string} sourceId  - starting stop _id string
 * @param {string} targetId  - destination stop _id string
 * @returns {Array|null} ordered list of { stopId, routeId, routeName } or null if no path
 */
export function bfs(graph, sourceId, targetId) {
  if (sourceId === targetId) return [];

  // Each queue entry: { stopId, path: [{ stopId, routeId, routeName }] }
  const queue = [{ stopId: sourceId, path: [] }];
  const visited = new Set([sourceId]);

  while (queue.length > 0) {
    const { stopId, path } = queue.shift();

    const neighbours = graph.get(stopId) || [];

    for (const edge of neighbours) {
      if (visited.has(edge.stopId)) continue;

      const newPath = [...path, { stopId: edge.stopId, routeId: edge.routeId, routeName: edge.routeName }];

      if (edge.stopId === targetId) {
        return newPath; // ✅ Found shortest path (fewest hops)
      }

      visited.add(edge.stopId);
      queue.push({ stopId: edge.stopId, path: newPath });
    }
  }

  return null; // No path found
}
