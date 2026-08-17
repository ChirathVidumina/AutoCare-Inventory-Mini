import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Billing module ready' });
});

export default router;
