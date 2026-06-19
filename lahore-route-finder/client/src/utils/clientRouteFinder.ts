import { clientBfs } from './clientBfs.ts';
import type { BfsResultEdge } from './clientBfs.ts';
import { buildGraph, buildStopIndex } from './clientGraphBuilder.ts';
import type { APIRoute, APIStop } from './clientGraphBuilder.ts';
import type { SearchResult, Leg } from '../store/slices/searchSlice.ts';

function buildLegs(path: BfsResultEdge[], sourceId: string, stopIndex: Map<string, APIStop>): Leg[] {
  if (!path || path.length === 0) return [];

  const legs: Leg[] = [];
  let currentLeg: Leg | null = null;
  let prevStopId = sourceId;

  for (const hop of path) {
    if (!currentLeg || currentLeg.routeId !== hop.routeId) {
      if (currentLeg) legs.push(currentLeg);
      const boardStop = stopIndex.get(prevStopId);
      currentLeg = {
        routeId: hop.routeId,
        routeName: hop.routeName,
        board: {
          stopId: prevStopId,
          name: boardStop?.name || prevStopId,
          location: boardStop?.locationId?.name || null,
          coordinates: boardStop?.coordinates || null,
        },
        alight: {
          stopId: '', name: '', location: null, coordinates: null
        },
        stops: [],
      };
    }

    const alightStop = stopIndex.get(hop.stopId);
    const alightLegStop = {
      stopId: hop.stopId,
      name: alightStop?.name || hop.stopId,
      location: alightStop?.locationId?.name || null,
      coordinates: alightStop?.coordinates || null,
    };
    
    currentLeg.stops.push(alightLegStop);
    currentLeg.alight = alightLegStop;

    prevStopId = hop.stopId;
  }

  if (currentLeg) legs.push(currentLeg);

  return legs;
}

export function clientFindRoute(
  originName: string,
  destinationName: string,
  allStops: APIStop[],
  allRoutes: APIRoute[]
): SearchResult | { error: string } {
  let originStop = allStops.find(s => s.name.toLowerCase() === originName.toLowerCase());
  if (!originStop) originStop = allStops.find(s => s.name.toLowerCase().includes(originName.toLowerCase()));

  let destinationStop = allStops.find(s => s.name.toLowerCase() === destinationName.toLowerCase());
  if (!destinationStop) destinationStop = allStops.find(s => s.name.toLowerCase().includes(destinationName.toLowerCase()));

  if (!originStop) return { error: `Origin stop not found: "${originName}"` };
  if (!destinationStop) return { error: `Destination stop not found: "${destinationName}"` };

  const sourceId = originStop._id;
  const targetId = destinationStop._id;

  if (sourceId === targetId) {
    return {
      origin: originStop.name,
      destination: destinationStop.name,
      algorithm: 'bfs',
      legs: [],
      message: 'Origin and destination are the same stop.',
      totalStops: 0,
      totalWeight: 0,
      transfers: 0
    };
  }

  const graph = buildGraph(allRoutes);
  const stopIndex = buildStopIndex(allRoutes);

  const rawPath = clientBfs(graph, sourceId, targetId);

  if (!rawPath) {
    return {
      origin: originStop.name,
      destination: destinationStop.name,
      algorithm: 'bfs',
      legs: [],
      message: 'No route could be found.',
      totalStops: 0,
      totalWeight: null,
      transfers: 0
    };
  }

  const legs = buildLegs(rawPath, sourceId, stopIndex);
  const transfers = Math.max(0, legs.length - 1);
  const totalStops = legs.reduce((sum, leg) => sum + leg.stops.length, 0);

  return {
    origin: originStop.name,
    destination: destinationStop.name,
    algorithm: 'bfs (Offline Fallback)',
    legs,
    totalStops,
    totalWeight: rawPath.length,
    transfers
  };
}
