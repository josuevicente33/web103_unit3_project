import express from 'express';
import locations from '../controllers/locationController.js';

const router = express.Router();

router.get('/', locations.getAllLocations);
router.get('/:id', locations.getLocationById);
router.post('/', locations.createLocation);

export default router;