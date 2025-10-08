import express from 'express';
import events from '../controllers/eventsController.js';

const router = express.Router();

router.get('/', events.getAllEvents);
router.get('/:id', events.getEventsById);
router.get('/date-range', events.getEventsByDateRange);
router.post('/', events.createEvent);

export default router;