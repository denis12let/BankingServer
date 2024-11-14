import express from 'express';
import checkRoleMiddleware from '../../middleware/checkRoleMiddleware.js';
import authMiddleware from '../../middleware/authMiddleware.js';
import profileController from '../../controllers/userControllers/profileController.js';

const router = express.Router();
const adminRouter = express.Router();

router.get('/', authMiddleware);
router.put('/', authMiddleware);

//роуты админов
adminRouter.use(checkRoleMiddleware('ADMIN'));

adminRouter.get('/all', profileController.getAll); //+
adminRouter.get('/:id');

router.use('/admin', adminRouter);

export default router;
