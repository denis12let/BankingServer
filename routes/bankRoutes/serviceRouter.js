import express from 'express';
import serviceController from '../../controllers/bankControllers/serviceController.js';

const router = express.Router();

router.get('/', serviceController.getAll);
router.get('/:id', serviceController.getOne);

router.post('/', serviceController.create);
router.put('/:id', serviceController.update);
router.delete('/:id', serviceController.delete);

export default router;
