import { Router } from 'express';
import { catalogController } from '../controllers/catalogController';

const router = Router();

router.get('/categories', catalogController.getCategories);
router.get('/brands', catalogController.getBrands);
router.get('/products', catalogController.getProducts);
router.get('/products/:id', catalogController.getProductById);
router.get('/services', catalogController.getServices);
router.get('/services/:id', catalogController.getServiceById);
router.get('/technicians', catalogController.getTechnicians);

export default router;
