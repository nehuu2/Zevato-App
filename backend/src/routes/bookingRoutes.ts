import { Router } from 'express';
import { bookingController } from '../controllers/bookingController';
import { requireAuth } from '../middleware/auth';

const router = Router();

// All booking routes require authenticated Clerk user
router.use(requireAuth);

router.get('/', bookingController.getBookings);
router.post('/', bookingController.createBooking);
router.get('/:id', bookingController.getBookingById);
router.patch('/:id/status', bookingController.updateBookingStatus);
router.patch('/:id/technician-location', bookingController.updateTechnicianLocation);
router.post('/:id/pay', bookingController.payBooking);
router.post('/:id/cancel', bookingController.cancelBooking);
router.get('/:id/invoice', bookingController.getInvoice);
router.get('/:id/report', bookingController.getReport);
router.post('/:id/report', bookingController.saveReport);

export default router;
