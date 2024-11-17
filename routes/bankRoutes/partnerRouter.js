import express from 'express';
import partnerController from '../../controllers/bankControllers/partnerController.js';
import checkRoleMiddleware from '../../middleware/checkRoleMiddleware.js';

const router = express.Router();
const adminRouter = express.Router();

router.get('/', partnerController.getAll);
router.get('/:id', partnerController.getOne);

// Роуты ТОЛЬКО для администраторов
adminRouter.use(checkRoleMiddleware('ADMIN'));

adminRouter.post('/', partnerController.create);
adminRouter.put('/:id', partnerController.update);
adminRouter.delete('/:id', partnerController.delete);

router.use('/admin', adminRouter);

export default router;
