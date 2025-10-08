import React, { useState, useEffect } from 'react'
import Event from '../components/Event'
import '../css/LocationEvents.css'
import LocationsAPI from '../services/LocationsAPI'

const locationsByIndex = {
    1: 'Riverside Park Pavilion',
    2: 'Tech Hub Auditorium',
    3: 'City Library – Room A',
    4: 'Eastside Sports Complex'
}

const LocationEvents = ({index}) => {
    const [location, setLocation] = useState([])
    const [events, setEvents] = useState([])

    useEffect(() => {
        (async () => {
            try {
                const locations = await LocationsAPI.getAllLocations()
                const locattionToSet = locations.find(loc => loc.name === locationsByIndex[index])
                setLocation(locattionToSet)

                const eventsData = await LocationsAPI.getEventsForLocation(locattionToSet.id)
                setEvents(eventsData)
            }
            catch (error) {
                throw error
            }
        }) ()
    }, [index])
    

    return (
        <div className='location-events'>
            <header>
                <div className='location-image'>
                    <img src={location.image} />
                </div>

                <div className='location-info'>
                    <h2>{location.name}</h2>
                    <p>{location.address}, {location.city}, {location.state} {location.zip}</p>
                </div>
            </header>

            <main>
                {
                    events && events.length > 0 ? events.map((event, index) =>
                        <Event
                            key={event.id}
                            id={event.id}
                            title={event.title}
                            date={event.date}
                            time={event.time}
                            image={event.image}
                        />
                    ) : <h2><i className="fa-regular fa-calendar-xmark fa-shake"></i> {'No events scheduled at this location yet!'}</h2>
                }
            </main>
        </div>
    )
}

export default LocationEvents