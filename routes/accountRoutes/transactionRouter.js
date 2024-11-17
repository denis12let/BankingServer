import express from 'express';
import transactionController from '../../controllers/accountControllers/transactionController.js';
import checkRoleMiddleware from '../../middleware/checkRoleMiddleware.js';

const router = express.Router();
const adminRouter = express.Router();

router.get('/', transactionController.getUserAll);
router.get('/calendar', transactionController.getCalendar);
router.get('/:id', transactionController.getOneById);
router.delete('/:id', transactionController.delete);

// Роуты ТОЛЬКО для администраторов
adminRouter.use(checkRoleMiddleware('ADMIN'));

adminRouter.get('/all', checkRoleMiddleware('ADMIN'), transactionController.getUsersAll);

router.use('/admin', adminRouter);

export default router;
