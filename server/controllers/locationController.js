import { pool } from '../config/database.js'

export const getAllLocations = async (req, res) => {
    try {
        const locations = await pool.query('SELECT * FROM locations ORDER BY name ASC');
        res.json(locations.rows);
    } catch (err) {
        console.error('Error fetching locations:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getLocationById = async (req, res) => {
    const { id } = req.params;
    try {
        const location = await pool.query('SELECT * FROM locations WHERE id = $1', [id]);
        if (location.rows.length === 0) {
            return res.status(404).json({ error: 'Location not found' });
        }
        res.json(location.rows[0]);
    } catch (err) {
        console.error('Error fetching location by ID:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createLocation = async (req, res) => {
    const { name, address, capacity } = req.body;
    try {
        const newLocation = await pool.query(
            'INSERT INTO locations (name, address, capacity) VALUES ($1, $2, $3) RETURNING *',
            [name, address, capacity]
        );
        res.status(201).json(newLocation.rows[0]);
    } catch (err) {
        console.error('Error creating location:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
export default { getAllLocations, getLocationById, createLocation };