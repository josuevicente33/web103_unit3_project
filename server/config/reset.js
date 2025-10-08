import './dotenv.js'
import { pool } from './database.js'
import data from  '../data/data.js'

const deleteTables = async () => {
    const query = `
    DROP TABLE IF EXISTS events;
    DROP TABLE IF EXISTS locations;
    `
    try {
        const res = await pool.query(query);
        console.log('Tables dropped if they existed.');
    } catch (err) {
        console.error('Error dropping tables:', err);
        throw err;
    }
}

await deleteTables();

const createEventsTable = async () => {
    const query = `
    DROP TABLE IF EXISTS events;

    CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        start_date TIMESTAMPTZ NOT NULL,
        end_date TIMESTAMPTZ NOT NULL,
        date VARCHAR(50),
        time VARCHAR(50),
        location_id INT REFERENCES locations(id) ON DELETE CASCADE,
        image VARCHAR(255),
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
        INSERT INTO events (title, start_date, end_date, date, time, location_id, description, image)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
        `;

        const locationResult = await pool.query('SELECT id FROM locations WHERE name = $1', [event.locationName]);
        if (locationResult.rows.length === 0) {
            console.error(`Location not found for event: ${event.name}`);
            return;
        }

        const values = [event.name, event.start_date, event.end_date, event.date, event.time, locationResult.rows[0].id, event.description, event.image];
        
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
        city VARCHAR(100),
        state VARCHAR(100),
        zip VARCHAR(20),
        capacity INT,
        image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `

    try {
        const res = await pool.query(query);
        console.log('Locations table created or already exists.');
    }
    catch (err) {
        console.error('Error creating locations table:', err);
    }
}

const insertLocationsData = async () => {
    await createLocationsTable();

    data.locations.forEach(async (location) => {
        const insertQuery = `
        INSERT INTO locations (name, address, city, state, zip, capacity, image)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
        `;
        const values = [location.name, location.address, location.city, location.state, location.zip, location.capacity, location.image];
        try {
            pool.query(insertQuery, values, (err, res) => {
                if (err) {
                    console.error('Error inserting location:', err);
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