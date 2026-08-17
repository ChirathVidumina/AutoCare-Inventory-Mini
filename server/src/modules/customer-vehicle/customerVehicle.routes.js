import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Customer vehicle module ready' });
});

export default router;
