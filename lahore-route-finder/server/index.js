import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import healthRouter from './routes/health.js';
import connectDB from './config/db.js';
import authRouter from './routes/auth.js';
import authMiddleware from './middleware/auth.js';
import locationRouter from './routes/location.js';
import stopRouter from './routes/stop.js';
import routeRouter from './routes/route.js';
import routeFinderRouter from './routes/routeFinder.js';

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// health check (no auth)
app.use('/api/health', healthRouter);

// auth routes
app.use('/api/auth', authRouter);

// protected example route (you can add more later)
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: 'You are authenticated', user: req.user });
});
app.use('/api/locations', locationRouter);
app.use('/api/stops', stopRouter);
app.use('/api/routes', routeRouter);
app.use('/api/route-finder', routeFinderRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
