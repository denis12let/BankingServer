import express from 'express';
import bankController from '../../controllers/bankControllers/bankController.js';
import checkRoleMiddleware from '../../middleware/checkRoleMiddleware.js';

const router = express.Router();

router.get('/', bankController.get);
router.put('/', bankController.update);

export default router;
