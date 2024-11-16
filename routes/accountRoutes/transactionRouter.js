import express from 'express';
import transactionController from '../../controllers/accountControllers/transactionController.js';

const router = express.Router();

router.get('/', transactionController.getAll); //Сделать все
router.get('/calendar', transactionController.getCalendar); //Сделать все
router.get('/:id', transactionController.getOneById);
router.delete('/:id', transactionController.delete);

export default router;
