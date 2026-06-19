import express from 'express';
import { body, param, validationResult } from 'express-validator';
import Location from '../models/Location.js';
import authMiddleware from '../middleware/auth.js';
import roleMiddleware from '../middleware/role.js';

const router = express.Router();

// Validation chains
const locationValidation = [
  body('name').notEmpty().withMessage('Name required'),
  body('city').optional().isString().withMessage('City must be a string'),
  body('coordinates.lat').optional().isFloat().withMessage('Latitude must be a number'),
  body('coordinates.lng').optional().isFloat().withMessage('Longitude must be a number')
];
const idValidation = [param('id').isMongoId().withMessage('Invalid ID')];

// Create (admin)
router.post(
  '/',
  authMiddleware,
  roleMiddleware('admin'),
  locationValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const loc = await Location.create(req.body);
      res.status(201).json(loc);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);

// List all (public)
router.get('/', async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get single
router.get('/:id', idValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const loc = await Location.findById(req.params.id);
    if (!loc) return res.status(404).json({ msg: 'Location not found' });
    res.json(loc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update (admin)
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('admin'),
  idValidation,
  locationValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const loc = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!loc) return res.status(404).json({ msg: 'Location not found' });
      res.json(loc);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);

// Delete (admin)
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('admin'),
  idValidation,
  async (req, res) => {
    try {
      const loc = await Location.findByIdAndDelete(req.params.id);
      if (!loc) return res.status(404).json({ msg: 'Location not found' });
      res.json({ msg: 'Location deleted' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);

export default router;
