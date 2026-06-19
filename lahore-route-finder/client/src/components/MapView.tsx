import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { SearchResult } from '../store/slices/searchSlice.ts';

// Dynamic viewport adjustments
function ChangeView({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  React.useEffect(() => {
    if (bounds && Array.isArray(bounds) && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);
  return null;
}

interface MapViewProps {
  result: SearchResult;
}

// Map helper to resolve transport color
function getRouteColor(routeName: string): string {
  const name = routeName.toLowerCase();
  if (name.includes('metrobus')) return '#22c55e'; // Green
  if (name.includes('orange')) return '#f5821f';   // Orange
  return '#3b82f6';                                 // Blue for Speedo
}

// Custom markers using CSS to avoid broken default asset URLs
const startIcon = L.divIcon({
  className: 'custom-marker-start',
  html: `<div style="background-color: #3b82f6; width: 14px; height: 14px; border-radius: 50%; border: 3px solid #fff; box-shadow: 0 0 10px rgba(59,130,246,0.6);"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const endIcon = L.divIcon({
  className: 'custom-marker-end',
  html: `<div style="background-color: #22c55e; width: 14px; height: 14px; border-radius: 50%; border: 3px solid #fff; box-shadow: 0 0 10px rgba(34,197,148,0.6);"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const transferIcon = L.divIcon({
  className: 'custom-marker-transfer',
  html: `<div style="background-color: #f5821f; width: 10px; height: 10px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 6px rgba(245,130,31,0.6);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

export default function MapView({ result }: MapViewProps) {
  const { legs } = result;

  // Extract all coordinates for plotting and bounding box fitting
  const allCoordinates: [number, number][] = [];
  const markers: {
    lat: number;
    lng: number;
    name: string;
    type: 'start' | 'end' | 'transfer';
    description?: string;
  }[] = [];

  if (legs.length > 0) {
    // Add Start Stop Marker
    const firstLeg = legs[0];
    if (firstLeg.board.coordinates) {
      const coords: [number, number] = [firstLeg.board.coordinates.lat, firstLeg.board.coordinates.lng];
      allCoordinates.push(coords);
      markers.push({
        lat: coords[0],
        lng: coords[1],
        name: firstLeg.board.name,
        type: 'start',
        description: 'Start of your journey',
      });
    }

    // Process all legs
    legs.forEach((leg, index) => {
      // Collect board stop coords if not first
      if (index > 0 && leg.board.coordinates) {
        const coords: [number, number] = [leg.board.coordinates.lat, leg.board.coordinates.lng];
        allCoordinates.push(coords);
        // Interchanges/Transfers
        markers.push({
          lat: coords[0],
          lng: coords[1],
          name: leg.board.name,
          type: 'transfer',
          description: `Transfer here to ${leg.routeName}`,
        });
      }

      // Collect intermediate stops
      leg.stops.forEach((stop) => {
        if (stop.coordinates) {
          allCoordinates.push([stop.coordinates.lat, stop.coordinates.lng]);
        }
      });

      // Collect alight stop coords
      if (leg.alight.coordinates) {
        allCoordinates.push([leg.alight.coordinates.lat, leg.alight.coordinates.lng]);
      }
    });

    // Add End Stop Marker
    const lastLeg = legs[legs.length - 1];
    if (lastLeg.alight.coordinates) {
      const coords: [number, number] = [lastLeg.alight.coordinates.lat, lastLeg.alight.coordinates.lng];
      // Push if not already there
      if (!allCoordinates.some(c => c[0] === coords[0] && c[1] === coords[1])) {
        allCoordinates.push(coords);
      }
      markers.push({
        lat: coords[0],
        lng: coords[1],
        name: lastLeg.alight.name,
        type: 'end',
        description: 'Destination',
      });
    }
  }

  // Fallback to Lahore center if no coordinates resolved
  const hasCoordinates = allCoordinates.length > 0;
  const mapCenter: [number, number] = hasCoordinates ? allCoordinates[0] : [31.5204, 74.3587];

  return (
    <div className="map-view-container" style={{ width: '100%', height: '100%', minHeight: '350px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
      <MapContainer
        center={mapCenter}
        zoom={12}
        style={{ width: '100%', height: '100%', minHeight: '350px' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {hasCoordinates && <ChangeView bounds={allCoordinates} />}

        {/* Polylines for legs */}
        {legs.map((leg, index) => {
          const pathPoints: [number, number][] = [];

          if (leg.board.coordinates) {
            pathPoints.push([leg.board.coordinates.lat, leg.board.coordinates.lng]);
          }

          leg.stops.forEach((stop) => {
            if (stop.coordinates) {
              pathPoints.push([stop.coordinates.lat, stop.coordinates.lng]);
            }
          });

          if (leg.alight.coordinates) {
            pathPoints.push([leg.alight.coordinates.lat, leg.alight.coordinates.lng]);
          }

          return (
            <Polyline
              key={`${leg.routeId}-${index}`}
              positions={pathPoints}
              pathOptions={{
                color: getRouteColor(leg.routeName),
                weight: 6,
                opacity: 0.8,
                lineJoin: 'round',
              }}
            />
          );
        })}

        {/* Markers for key stops */}
        {markers.map((marker, i) => {
          let icon = startIcon;
          if (marker.type === 'end') icon = endIcon;
          if (marker.type === 'transfer') icon = transferIcon;

          return (
            <Marker key={i} position={[marker.lat, marker.lng]} icon={icon}>
              <Popup>
                <div style={{ color: '#111827', fontFamily: 'sans-serif' }}>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: 700 }}>{marker.name}</h3>
                  {marker.description && <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>{marker.description}</p>}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Small circles for intermediate stops */}
        {legs.flatMap((leg) => leg.stops.slice(0, -1)).map((stop, i) => {
          if (!stop.coordinates) return null;
          return (
            <CircleMarker
              key={`circle-${i}`}
              center={[stop.coordinates.lat, stop.coordinates.lng]}
              radius={4}
              pathOptions={{
                color: '#fff',
                fillColor: '#1e293b',
                fillOpacity: 1,
                weight: 2,
              }}
            >
              <Popup>
                <div style={{ color: '#111827', fontFamily: 'sans-serif', fontSize: '0.85rem' }}>
                  <strong>{stop.name}</strong>
                  {stop.location && <div style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '2px' }}>{stop.location}</div>}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
