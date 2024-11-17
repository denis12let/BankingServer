import express from 'express';
import bankNewsController from '../../controllers/bankControllers/bankNewsController.js';
import checkRoleMiddleware from '../../middleware/checkRoleMiddleware.js';

const router = express.Router();
const adminRouter = express.Router();

router.get('/', bankNewsController.getAll);
router.get('/:id', bankNewsController.getOne);

// Роуты ТОЛЬКО для администраторов
adminRouter.use(checkRoleMiddleware('ADMIN'));

adminRouter.post('/', bankNewsController.create);
adminRouter.put('/:id', bankNewsController.update);
adminRouter.delete('/:id', bankNewsController.delete);

router.use('/admin', adminRouter);

export default router;
