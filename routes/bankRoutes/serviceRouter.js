import express from 'express';
import serviceController from '../../controllers/bankControllers/serviceController.js';
import checkRoleMiddleware from '../../middleware/checkRoleMiddleware.js';

const router = express.Router();
const adminRouter = express.Router();

router.get('/', serviceController.getAll);
router.get('/:id', serviceController.getOne);

// Роуты ТОЛЬКО для администраторов
adminRouter.use(checkRoleMiddleware('ADMIN'));

adminRouter.post('/', serviceController.create);
adminRouter.put('/:id', serviceController.update);
adminRouter.delete('/:id', serviceController.delete);

router.use('/admin', adminRouter);

export default router;
