import express from 'express';

const router = express.Router();

router.get('/');
router.post('/');
router.delete('/:id');

router.get('/:id');

export default router;
