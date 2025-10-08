import { pool } from '../config/database.js'

export const getAllEvents = async (req, res) => {
    try {
        const events = await pool.query('SELECT * FROM events ORDER BY date ASC');
        res.json(events.rows);
    } catch (err) {
        console.error('Error fetching events:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getEventsById = async (req, res) => {
    const { id } = req.params;
    try {
        const event = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
        if (event.rows.length === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json(event.rows[0]);
    } catch (err) {
        console.error('Error fetching event by ID:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getEventsByDateRange = async (req, res) => {
    const { startDate, endDate } = req.query;
    try {
        const events = await pool.query(
            'SELECT * FROM events WHERE date BETWEEN $1 AND $2 ORDER BY date ASC',
            [startDate, endDate]
        );
        res.json(events.rows);
    } catch (err) {
        console.error('Error fetching events by date range:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createEvent = async (req, res) => {
    const { name, date, location, description } = req.body;
    try {
        const newEvent = await pool.query(
            'INSERT INTO events (name, date, location, description) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, date, location, description]
        );
        res.status(201).json(newEvent.rows[0]);
    } catch (err) {
        console.error('Error creating event:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default { getAllEvents, getEventsById, getEventsByDateRange, createEvent };