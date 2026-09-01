import { Router } from 'express';
import { userController } from '../controllers/userController';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Profile endpoints
router.get('/me', requireAuth, userController.getProfile);
router.patch('/me', requireAuth, userController.updateProfile);

// Address endpoints
router.get('/addresses', requireAuth, userController.getAddresses);
router.post('/addresses', requireAuth, userController.createAddress);
router.patch('/addresses/:id', requireAuth, userController.updateAddress);
router.delete('/addresses/:id', requireAuth, userController.deleteAddress);
router.patch('/addresses/:id/default', requireAuth, userController.setDefaultAddress);

export default router;
