import express from 'express';
import userController from '../../controllers/userControllers/userController.js';
import authMiddleware from '../../middleware/authMiddleware.js';
import checkRoleMiddleware from '../../middleware/checkRoleMiddleware.js';

const router = express.Router();
const adminRouter = express.Router();

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.get('/auth', authMiddleware, userController.check);

// Роуты для админов и обыных юзеров
router.get('/id/:id', authMiddleware, userController.getOneById);

// Роуты для ТОЛЬКО для обыных юзеров
router.put('/:id', authMiddleware, userController.update);

// Роуты ТОЛЬКО для администраторов
adminRouter.use(checkRoleMiddleware('ADMIN'));

adminRouter.get('/email/:email', userController.getOneByEmail);
adminRouter.get('/all', userController.getAll);
adminRouter.post('/', userController.create);
adminRouter.delete('/:id', userController.delete);

router.use('/admin', adminRouter);

export default router;
