import { Router } from 'express';
import { getFlights, getFlightById, getAirports } from '../controllers/flight.controller.js';

const router = Router();

router.get('/', getFlights);
router.get('/airports', getAirports);
router.get('/:id', getFlightById);

export default router;
