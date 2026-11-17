import { Router } from 'express';
import { getHotels, getHotelById, getPropertyTypes } from '../controllers/hotel.controller.js';

const router = Router();

router.get('/', getHotels);
router.get('/property-types', getPropertyTypes);
router.get('/:id', getHotelById);

export default router;
