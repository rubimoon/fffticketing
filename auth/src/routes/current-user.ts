import express from 'express';
import { currentUser } from '@fftickets/common';
import { CURRENT_USER_API } from '../api';

const router = express.Router();

router.get(CURRENT_USER_API, currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
