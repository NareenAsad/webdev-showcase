import type { AdjacencyList } from './clientBfs.ts';

// Route shape as fetched from GET /api/routes
export interface APIRoute {
  _id: string;
  name: string;
  stops: APIStop[];
}

export interface APIStop {
  _id: string;
  name: string;
  locationId?: { _id: string; name: string };
  coordinates?: { lat: number; lng: number };
}

export function buildGraph(routes: APIRoute[]): AdjacencyList {
  const graph: AdjacencyList = new Map();

  for (const route of routes) {
    const stops = route.stops;
    for (let i = 0; i < stops.length; i++) {
      const fromId = stops[i]._id;

      if (!graph.has(fromId)) graph.set(fromId, []);

      for (let j = i + 1; j < stops.length; j++) {
        const toId = stops[j]._id;

        if (!graph.has(toId)) graph.set(toId, []);

        const forwardEdge = {
          stopId: toId,
          routeId: route._id,
          routeName: route.name,
          weight: j - i,
          board: { stopId: fromId, name: stops[i].name, location: stops[i].locationId?.name || null, coordinates: stops[i].coordinates || null },
          alight: { stopId: toId, name: stops[j].name, location: stops[j].locationId?.name || null, coordinates: stops[j].coordinates || null }
        };

        const reverseEdge = {
          stopId: fromId,
          routeId: route._id,
          routeName: route.name,
          weight: j - i,
          board: { stopId: toId, name: stops[j].name, location: stops[j].locationId?.name || null, coordinates: stops[j].coordinates || null },
          alight: { stopId: fromId, name: stops[i].name, location: stops[i].locationId?.name || null, coordinates: stops[i].coordinates || null }
        };

        graph.get(fromId)?.push(forwardEdge);
        graph.get(toId)?.push(reverseEdge);
      }
    }
  }

  return graph;
}

export function buildStopIndex(routes: APIRoute[]): Map<string, APIStop> {
  const stopIndex = new Map<string, APIStop>();
  for (const route of routes) {
    for (const stop of route.stops) {
      if (!stopIndex.has(stop._id)) stopIndex.set(stop._id, stop);
    }
  }
  return stopIndex;
}
