import { Router } from 'express';
import { getReviews } from '../controllers/review.controller.js';

const router = Router();

router.get('/', getReviews);

export default router;
