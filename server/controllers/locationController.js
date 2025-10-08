import pool from '../config/database.js'

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
