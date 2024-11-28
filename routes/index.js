import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import account from './accountRoutes/accountRouter.js';
import bankNews from './bankRoutes/bankNewsRouter.js';
import bank from './bankRoutes/bankRouter.js';
import basket from './accountRoutes/basketRouter.js';
import card from './accountRoutes/cardRouter.js';
import partner from './bankRoutes/partnerRouter.js';
import profile from './userRoutes/profileRouter.js';
import service from './bankRoutes/serviceRouter.js';
import transaction from './accountRoutes/transactionRouter.js';
import user from './userRoutes/userRouter.js';

const router = express.Router();
const accountRoutes = express.Router();
const bankRoutes = express.Router();
const userRoutes = express.Router();

//Базовые
router.use('/accounts', authMiddleware, accountRoutes);
router.use('/bank', bankRoutes);
router.use('/users', userRoutes);

//Для аккаунта
accountRoutes.use('/cards', card);
accountRoutes.use('/basket', basket);
accountRoutes.use('/transactions', transaction);
accountRoutes.use(account);

//Пользовательские
userRoutes.use(user);
userRoutes.use('/profiles', authMiddleware, profile);

//Банковские
bankRoutes.use('/news', bankNews);
bankRoutes.use(bank);
bankRoutes.use('/partners', partner);
bankRoutes.use('/services', service);

export default router;
