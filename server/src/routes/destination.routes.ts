import { Router } from 'express';
import { getDestinations, autocompleteDestinations } from '../controllers/destination.controller.js';

const router = Router();

router.get('/', getDestinations);
router.get('/autocomplete', autocompleteDestinations);

export default router;
