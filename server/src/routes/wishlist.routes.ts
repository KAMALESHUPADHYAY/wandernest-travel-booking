import { Router } from 'express';
import { toggleWishlist, getWishlist } from '../controllers/wishlist.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/toggle', authenticate, toggleWishlist);
router.get('/', authenticate, getWishlist);

export default router;
