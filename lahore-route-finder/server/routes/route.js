import express from 'express';
import { body, param, validationResult } from 'express-validator';
import RouteModel from '../models/Route.js';
import authMiddleware from '../middleware/auth.js';
import roleMiddleware from '../middleware/role.js';

const router = express.Router();

// Validation chains
const routeValidation = [
  body('name').notEmpty().withMessage('Name required'),
  body('stops').isArray().withMessage('Stops must be an array'),
  body('stops.*').isMongoId().withMessage('Each stop must be a valid ID'),
  body('distance').optional().isFloat({ min: 0 }).withMessage('Distance must be a positive number'),
  body('duration').optional().isFloat({ min: 0 }).withMessage('Duration must be a positive number')
];
const idValidation = [param('id').isMongoId().withMessage('Invalid ID')];

// Create (admin)
router.post(
  '/',
  authMiddleware,
  roleMiddleware('admin'),
  routeValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const route = await RouteModel.create(req.body);
      res.status(201).json(route);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);

// List all (public)
router.get('/', async (req, res) => {
  try {
    const routes = await RouteModel.find();
    res.json(routes);
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
    const route = await RouteModel.findById(req.params.id);
    if (!route) return res.status(404).json({ msg: 'Route not found' });
    res.json(route);
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
  routeValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const route = await RouteModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!route) return res.status(404).json({ msg: 'Route not found' });
      res.json(route);
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
      const route = await RouteModel.findByIdAndDelete(req.params.id);
      if (!route) return res.status(404).json({ msg: 'Route not found' });
      res.json({ msg: 'Route deleted' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);

export default router;
