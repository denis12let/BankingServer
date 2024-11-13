import express from 'express';
import partnerController from '../../controllers/bankControllers/partnerController.js';

const router = express.Router();

router.get('/', partnerController.getAll);
router.get('/:id', partnerController.getOne);

router.post('/', partnerController.create);
router.put('/:id', partnerController.update);
router.delete('/:id', partnerController.delete);

export default router;
