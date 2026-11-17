import { Router } from 'express';
import {
  getDestinations,
  getDestinationBySlug,
  autocompleteDestinations,
} from '../controllers/destination.controller.js';

const router = Router();

router.get('/', getDestinations);
router.get('/autocomplete', autocompleteDestinations);
router.get('/:slug', getDestinationBySlug);

export default router;
