import express from 'express';
import basketController from '../../controllers/accountControllers/basketController.js';

const router = express.Router();

router.get('/', basketController.getBasketSize); //просто кол-во услуг в корзине
router.get('/services', basketController.getServices); //сделать фильтры
router.get('/services/:id', basketController.getService);
router.post('/services/:id', basketController.addService);
router.delete('/services/:id', basketController.deleteService);

export default router;
