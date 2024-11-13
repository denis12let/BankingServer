import express from 'express';
import bank from '../controllers/bankController.js';

const router = express.Router();

router.get('/', bank.get);
router.put('/', bank.update);

export default router;
