import express from 'express';
import events from '../controllers/eventsController.js';

const router = express.Router();

router.get('/date-range', events.getEventsByDateRange);
router.get('/:id(\\d+)', events.getEventsById);
router.get('/', events.getAllEvents);
router.post('/', events.createEvent);

export default router;