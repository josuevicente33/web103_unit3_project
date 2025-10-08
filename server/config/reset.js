import pool from './database.js'
import data from  './data.js'

const createEventsTable = async () => {
    const query = `
    DROP TABLE IF EXISTS events;

    CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        location_id INT REFERENCES locations(id) ON DELETE CASCADE,
        description TEXT
    );
    `

    try {
        const res = await pool.query(query);
        console.log('Events table created or already exists.');
    } catch (err) {
        console.error('Error creating events table:', err);
        throw err;
    }
}


const insertSampleData = async () => {
    await createEventsTable();

    data.events.forEach(async (event) => {
        const insertQuery = `
        INSERT INTO events (name, date, location_id, description)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `;

        const values = [event.name, event.start_date, event.end_date, event.locationId, event.description];
        
        try {
            pool.query(insertQuery, values, (err, res) => {
                if (err) {
                    console.error('Error inserting event:', err);
                    return;
                }
                console.log('Inserted event:', res.rows[0]);
            });
        } catch (err) {
            console.error('Error inserting event:', err);
        }
    });
}

const createLocationsTable = async () => {
    const query = `
    DROP TABLE IF EXISTS locations;
    CREATE TABLE IF NOT EXISTS locations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        address VARCHAR(200) NOT NULL,
        capacity INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `

    try {
        const res = await pool.query(query);
        console.log('Locations table created or already exists.');
    }
    catch (err) {
        console.error('Error creating locations table:', err);
        throw err;
    }
}

const insertLocationsData = async () => {
    await createLocationsTable();

    data.locations.forEach(async (location) => {
        const insertQuery = `
        INSERT INTO locations (name, address, capacity)
        VALUES ($1, $2, $3)
        RETURNING *;
        `;
        const values = [location.name, location.address, location.capacity];
        try {
            pool.query(insertQuery, values, (err, res) => {
                if (err) {
                    console.error('Error inserting location:', err);
                    return;
                }
                console.log('Inserted location:', res.rows[0]);
            });
        } catch (err) {
            console.error('Error inserting location:', err);
        }
    });
}

insertLocationsData();
insertSampleData();
