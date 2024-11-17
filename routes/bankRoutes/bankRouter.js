import express from 'express';
import bankController from '../../controllers/bankControllers/bankController.js';
import checkRoleMiddleware from '../../middleware/checkRoleMiddleware.js';

const router = express.Router();
const adminRouter = express.Router();

router.get('/', bankController.get);

// Роуты ТОЛЬКО для администраторов
adminRouter.use(checkRoleMiddleware('ADMIN'));

adminRouter.put('/', checkRoleMiddleware('ADMIN'), bankController.update);

router.use('/admin', adminRouter);

export default router;
