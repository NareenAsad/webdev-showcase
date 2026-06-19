/**
 * Haversine formula — returns distance in kilometres between two lat/lng points.
 * @param {number} lat1
 * @param {number} lng1
 * @param {number} lat2
 * @param {number} lng2
 * @returns {number} distance in km
 */
export function haversineDistance(lat1, lng1, lat2, lng2) {
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

/**
 * Given a list of stops (each with a populated locationId.coordinates),
 * find the stop nearest to the provided coordinates.
 * @param {Array} stops   - populated stop documents
 * @param {number} lat
 * @param {number} lng
 * @returns {{ stop, distance }} nearest stop and its distance in km
 */
export function findNearestStop(stops, lat, lng) {
  let nearest = null;
  let minDist = Infinity;

  for (const stop of stops) {
    const coords = stop.locationId?.coordinates;
    if (!coords || coords.lat == null || coords.lng == null) continue;
    const dist = haversineDistance(lat, lng, coords.lat, coords.lng);
    if (dist < minDist) {
      minDist = dist;
      nearest = stop;
    }
  }

  return { stop: nearest, distance: minDist };
}
