import express from 'express';
import locations from '../controllers/locationController.js';

const router = express.Router();

router.get('/', locations.getAllLocations);
router.get('/:id(\\d+)/events', locations.getEventsForLocation);
router.get('/:id(\\d+)', locations.getLocationById);

export default router;