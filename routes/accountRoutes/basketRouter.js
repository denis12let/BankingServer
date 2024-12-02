import express from 'express';
import basketController from '../../controllers/accountControllers/basketController.js';

const router = express.Router();

router.get('/', basketController.getBasketSize);
router.get('/services', basketController.getServices);
router.get('/services/:id', basketController.getService);
router.post('/services/:id', basketController.addService);
router.delete('/services/:id', basketController.deleteService);

export default router;
