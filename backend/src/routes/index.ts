import { Router } from 'express';
import userRoutes from './userRoutes';
import catalogRoutes from './catalogRoutes';
import bookingRoutes from './bookingRoutes';
import notificationRoutes from './notificationRoutes';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Zevota REST API',
    realtime: 'Socket.IO Enabled',
    notifications: 'Expo Push Enabled',
    payments: 'Simulated Demo Gateway',
  });
});

// Mounted sub-routes
router.use('/', userRoutes);
router.use('/', catalogRoutes);
router.use('/bookings', bookingRoutes);
router.use('/notifications', notificationRoutes);

export default router;
