import { Router } from 'express';
import { getFlights } from '../controllers/flight.controller.js';

const router = Router();

router.get('/', getFlights);

export default router;
