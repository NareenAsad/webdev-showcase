import type { LegStop } from '../store/slices/searchSlice.ts';

export interface GraphEdge {
  stopId: string;
  routeId: string;
  routeName: string;
  board: LegStop;
  alight: LegStop;
  weight: number;
}

export type AdjacencyList = Map<string, GraphEdge[]>;

export interface BfsResultEdge {
  stopId: string;
  routeId: string;
  routeName: string;
}

export function clientBfs(graph: AdjacencyList, sourceId: string, targetId: string): BfsResultEdge[] | null {
  if (sourceId === targetId) return [];

  const queue: { stopId: string; path: BfsResultEdge[] }[] = [{ stopId: sourceId, path: [] }];
  const visited = new Set<string>([sourceId]);

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue;
    const { stopId, path } = current;

    const neighbours = graph.get(stopId) || [];

    for (const edge of neighbours) {
      if (visited.has(edge.stopId)) continue;

      const newPath = [...path, { stopId: edge.stopId, routeId: edge.routeId, routeName: edge.routeName }];

      if (edge.stopId === targetId) {
        return newPath; 
      }

      visited.add(edge.stopId);
      queue.push({ stopId: edge.stopId, path: newPath });
    }
  }

  return null;
}
