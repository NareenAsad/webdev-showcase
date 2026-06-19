/**
 * routes/routeFinder.js
 *
 * Exposes POST /api/route-finder/search
 *
 * Request body (JSON):
 * {
 *   "originName": "Gajjumata",          // name-based lookup (preferred)
 *   "destinationName": "Thokar Niaz Baig",
 *   "algorithm": "bfs"                  // or "dijkstra" (optional, default: bfs)
 * }
 *
 * OR coordinate-based:
 * {
 *   "originLat": 31.5,  "originLng": 74.3,
 *   "destinationLat": 31.4, "destinationLng": 74.2,
 *   "algorithm": "dijkstra"
 * }
 */

import express from 'express';
import { body, validationResult } from 'express-validator';
import { findRoute } from '../utils/routeFinder.js';

const router = express.Router();

// Validation: at least one of (name | lat+lng) must be provided for both ends
const searchValidation = [
  body('algorithm')
    .optional()
    .isIn(['bfs', 'dijkstra'])
    .withMessage('algorithm must be "bfs" or "dijkstra"'),
  body('originName')
    .optional()
    .isString()
    .withMessage('originName must be a string'),
  body('destinationName')
    .optional()
    .isString()
    .withMessage('destinationName must be a string'),
  body('originLat').optional().isFloat().withMessage('originLat must be a float'),
  body('originLng').optional().isFloat().withMessage('originLng must be a float'),
  body('destinationLat').optional().isFloat().withMessage('destinationLat must be a float'),
  body('destinationLng').optional().isFloat().withMessage('destinationLng must be a float'),
];

router.post('/search', searchValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const {
    originName,
    destinationName,
    originLat,
    originLng,
    destinationLat,
    destinationLng,
    algorithm = 'bfs',
  } = req.body;

  // Ensure at minimum a name or coordinate pair is supplied for each end
  const hasOrigin = originName || (originLat != null && originLng != null);
  const hasDestination = destinationName || (destinationLat != null && destinationLng != null);

  if (!hasOrigin) {
    return res.status(400).json({ msg: 'Provide originName or (originLat + originLng)' });
  }
  if (!hasDestination) {
    return res.status(400).json({ msg: 'Provide destinationName or (destinationLat + destinationLng)' });
  }

  try {
    const result = await findRoute({
      originName,
      destinationName,
      originLat: originLat ? parseFloat(originLat) : null,
      originLng: originLng ? parseFloat(originLng) : null,
      destinationLat: destinationLat ? parseFloat(destinationLat) : null,
      destinationLng: destinationLng ? parseFloat(destinationLng) : null,
      algorithm,
    });

    if (result.error) {
      return res.status(404).json({ msg: result.error });
    }

    return res.json(result);
  } catch (err) {
    console.error('Route finder error:', err);
    return res.status(500).json({ msg: 'Server error during route search' });
  }
});

export default router;
