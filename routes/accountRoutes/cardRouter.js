import express from 'express';
import cardController from '../../controllers/accountControllers/cardController.js';

const router = express.Router();

router.get('/', cardController.getAll);
router.get('/:id', cardController.getOneById);
router.post('/', cardController.create);
router.put('/:id', cardController.update);
router.post('/balance', cardController.updateBalance);
router.delete('/:id', cardController.delete);

export default router;
