import express from 'express';
import accountController from '../../controllers/accountControllers/accountController.js';

const router = express.Router();

router.get('/', accountController.getOneById);
router.put('/', accountController.update);

export default router;
