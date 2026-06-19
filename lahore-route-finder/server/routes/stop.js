import express from 'express';
import { body, param, validationResult } from 'express-validator';
import Stop from '../models/Stop.js';
import authMiddleware from '../middleware/auth.js';
import roleMiddleware from '../middleware/role.js';

const router = express.Router();

// Validation chains
const stopValidation = [
  body('name').notEmpty().withMessage('Name required'),
  body('locationId').isMongoId().withMessage('Valid locationId required'),
  body('order').optional().isInt({ min: 0 }).withMessage('Order must be a non‑negative integer')
];
const idValidation = [param('id').isMongoId().withMessage('Invalid ID')];

// Create (admin)
router.post(
  '/',
  authMiddleware,
  roleMiddleware('admin'),
  stopValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const stop = await Stop.create(req.body);
      res.status(201).json(stop);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);

// List all (public)
router.get('/', async (req, res) => {
  try {
    const stops = await Stop.find();
    res.json(stops);
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
    const stop = await Stop.findById(req.params.id);
    if (!stop) return res.status(404).json({ msg: 'Stop not found' });
    res.json(stop);
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
  stopValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const stop = await Stop.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!stop) return res.status(404).json({ msg: 'Stop not found' });
      res.json(stop);
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
      const stop = await Stop.findByIdAndDelete(req.params.id);
      if (!stop) return res.status(404).json({ msg: 'Stop not found' });
      res.json({ msg: 'Stop deleted' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);

export default router;
