import { Router } from 'express';
import { getHotels, getPropertyTypes } from '../controllers/hotel.controller.js';

const router = Router();

router.get('/', getHotels);
router.get('/property-types', getPropertyTypes);

export default router;
