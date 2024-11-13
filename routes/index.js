import express from 'express';
import account from './accountRouter.js';
import accountStatement from './accountStatementRouter.js';
import bankNews from './bankNewsRouter.js';
import bank from './bankRouter.js';
import basket from './basketRouter.js';
import card from './cardRouter.js';
import partner from './partnerRouter.js';
import profile from './profileRouter.js';
import service from './serviceRouter.js';
import transaction from './transactionRouter.js';
import user from './userRouter.js';

const router = express.Router();
const accountRouters = express.Router();
const bankRouters = express.Router();

router.use('/accounts/:account', accountRouters);
router.use('/bank', bankRouters);

accountRouters.use('/cards', card);
accountRouters.use('/accountStatement', accountStatement);
accountRouters.use('/basket', basket);
accountRouters.use('/profile', profile);
accountRouters.use('/transaction', transaction);

router.use('/accounts', account);
router.use('/services', service);
router.use('/users', user);

bankRouters.use('/news', bankNews);
bankRouters.use(bank);
bankRouters.use('/partners', partner);

export default router;
