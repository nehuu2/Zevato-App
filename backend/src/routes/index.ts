import { Router } from 'express';
import userRoutes from './userRoutes';
import catalogRoutes from './catalogRoutes';
import bookingRoutes from './bookingRoutes';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Zevota REST API',
  });
});

// Mounted sub-routes
router.use('/', userRoutes);
router.use('/', catalogRoutes);
router.use('/bookings', bookingRoutes);

export default router;
