import express from 'express';
import checkRoleMiddleware from '../../middleware/checkRoleMiddleware.js';
import profileController from '../../controllers/userControllers/profileController.js';

const router = express.Router();
const adminRouter = express.Router();

router.get('/', profileController.getOneById);
router.post('/', profileController.create);
router.put('/', profileController.update);

// Роуты ТОЛЬКО для администраторов
adminRouter.use(checkRoleMiddleware('ADMIN'));

adminRouter.get('/all', profileController.getAll);
adminRouter.get('/id/:id', profileController.getOneById);

router.use('/admin', adminRouter);

export default router;
