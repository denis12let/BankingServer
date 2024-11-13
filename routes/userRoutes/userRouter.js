import express from 'express';

const router = express.Router();

router.post('/registration');
router.post('/login');
router.get('/auth');

router.get('/');
router.delete('/:id');

export default router;
