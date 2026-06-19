/**
 * dijkstra.js — Fastest-route search using Dijkstra's algorithm.
 *
 * Uses the edge `weight` (number of stops traversed) as cost.
 * For a more accurate time estimate, weights can be replaced with
 * haversine distances (the graphBuilder attaches stop coordinates for this purpose).
 *
 * @param {Map}    graph     - adjacency list from graphBuilder.buildGraph()
 * @param {string} sourceId  - starting stop _id string
 * @param {string} targetId  - destination stop _id string
 * @returns {{ path: Array, totalWeight: number }|null}
 *          path = ordered list of { stopId, routeId, routeName, weight }
 *          or null if no path exists
 */
export function dijkstra(graph, sourceId, targetId) {
  if (sourceId === targetId) return { path: [], totalWeight: 0 };

  // dist[stopId] = minimum cumulative weight to reach that stop
  const dist = new Map();
  // prev[stopId] = { fromStopId, edge } for path reconstruction
  const prev = new Map();
  // Simple priority queue (min-heap would be faster, but JS has none built-in)
  // Format: [{ stopId, cost }]
  const pq = [];

  dist.set(sourceId, 0);
  pq.push({ stopId: sourceId, cost: 0 });

  // Mark all others as Infinity
  for (const [id] of graph) {
    if (id !== sourceId) dist.set(id, Infinity);
  }

  while (pq.length > 0) {
    // Pop minimum-cost node
    pq.sort((a, b) => a.cost - b.cost);
    const { stopId: current, cost: currentCost } = pq.shift();

    if (current === targetId) break; // Found

    if (currentCost > (dist.get(current) ?? Infinity)) continue; // Stale entry

    const neighbours = graph.get(current) || [];
    for (const edge of neighbours) {
      const newCost = currentCost + edge.weight;
      const existingCost = dist.get(edge.stopId) ?? Infinity;

      if (newCost < existingCost) {
        dist.set(edge.stopId, newCost);
        prev.set(edge.stopId, { fromStopId: current, edge });
        pq.push({ stopId: edge.stopId, cost: newCost });
      }
    }
  }

  // No path found
  if ((dist.get(targetId) ?? Infinity) === Infinity) return null;

  // Reconstruct path
  const path = [];
  let current = targetId;
  while (prev.has(current)) {
    const { fromStopId, edge } = prev.get(current);
    path.unshift({ stopId: edge.stopId, routeId: edge.routeId, routeName: edge.routeName, weight: edge.weight });
    current = fromStopId;
  }

  return { path, totalWeight: dist.get(targetId) };
}
