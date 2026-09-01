import { Router } from 'express';
import { notificationController } from '../controllers/notificationController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.post('/register-token', notificationController.registerToken);
router.post('/unregister-token', notificationController.unregisterToken);
router.delete('/unregister-token', notificationController.unregisterToken);

export default router;
