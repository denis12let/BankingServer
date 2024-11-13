import express from 'express';
import bankNewsController from '../controllers/bankNewsController.js';

const router = express.Router();

router.get('/', bankNewsController.getAll);
router.get('/:id', bankNewsController.getOne);

router.post('/', bankNewsController.create);
router.put('/:id', bankNewsController.update);
router.delete('/:id', bankNewsController.delete);

export default router;
