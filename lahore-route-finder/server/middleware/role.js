import User from '../models/User.js';

const roleMiddleware = (requiredRole) => async (req, res, next) => {
  if (!req.user) return res.status(401).json({ msg: 'Unauthorized' });
  if (req.user.role !== requiredRole) return res.status(403).json({ msg: 'Forbidden: insufficient role' });
  // optionally fetch full user
  // const user = await User.findById(req.user.id);
  // req.user = user;
  next();
};

export default roleMiddleware;
