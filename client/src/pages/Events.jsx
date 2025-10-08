import React, { useEffect, useState } from 'react'
import EventsAPI from '../services/EventsAPI'
import { format } from 'date-fns'
import '../css/Events.css'

const Events = () => {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [dateRange, setDateRange] = useState({startDate: '', endDate: ''})
    const [filteredEvents, setFilteredEvents] = useState([])
    const [filterApplied, setFilterApplied] = useState(false)

    const [locationFilter, setLocationFilter] = useState('')
    const [locations, setLocations] = useState([])

    useEffect(() => {
        (async () => {
            try {
                const eventsData = await EventsAPI.getAllEvents()
                console.log('Fetched events:', eventsData)
                setEvents(eventsData)
                setLoading(false)
            }
            catch (error) {
                setError('Failed to fetch events. Please try again later.')
                setLoading(false)
                throw error
            }
        }) ()
    }, [])

    useEffect(() => {
        (async () => {
            try {
                const locationsData = await fetch('/api/locations').then(res => res.json())
                setLocations(locationsData)
            }
            catch (error) {
                console.error('Failed to fetch locations:', error)
            }
        }) ()
    }, [])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setDateRange(prevState => ({ ...prevState, [name]: value }))
    }
    const handleFilterSubmit = async (e) => {
        e.preventDefault()

        const start = dateRange.startDate
        const end = dateRange.endDate ? dateRange.endDate + 'T23:59:59' : start + 'T23:59:59'

        if (!start || !end) {
            setError('Please select both start and end dates.')
        }
        
        try {
            let eventsData = events

            if (start && end) {
                eventsData = await EventsAPI.getEventsByDateRange(start, end)
            }

            if (locationFilter) {
                const locationId = parseInt(locationFilter, 10)
                eventsData = eventsData.filter(event => event.location_id === locationId)
            }

            setFilteredEvents(eventsData)
            setFilterApplied(true)
            setError(null)
        }   catch (error) {             
            setError('Failed to fetch events. Please try again later.')
        }
    }
    const clearFilter = () => {
        setFilterApplied(false)
        setFilteredEvents([])
        setDateRange({startDate: '', endDate: ''})
        setError(null)
    }

    const handleLocationChange = (e) => setLocationFilter(e.target.value);

    if (loading) return <div className='loading'>Loading events...</div>

    return (
        <div className='events-page'>
            <div>
                <h1>Upcoming Events</h1>
            </div>
            <form className='date-filter-form' onSubmit={handleFilterSubmit}>
                <div className='date-inputs'>
                    <label>
                        Start Date:
                        <input type='date' name='startDate' value={dateRange.startDate} onChange={handleInputChange} />
                    </label>
                    <label>
                        End Date:
                        <input type='date' name='endDate' value={dateRange.endDate} onChange={handleInputChange} />
                    </label>
                </div>

                <div className='location-filter'>
                    <label>
                        <select
                            className='location-dropdown'
                            value={locationFilter}
                            onChange={handleLocationChange}
                        >
                        <option value=''>All Locations</option>
                        {locations.map(loc => (
                            <option key={loc.id} value={String(loc.id)}>{loc.name}</option>
                        ))}
                        </select>
                    </label>
                </div>
                
                <button type='submit'>Filter</button>
                {error && <div className='error'>{error}</div>}
                {filterApplied && <button type='button' onClick={clearFilter}>Clear Filter</button>}
            </form>
            <div className='events-grid'>
                {(filterApplied ? filteredEvents : events).length === 0 ? (
                    <p>No events found for the selected date range.</p>
                ) : (
                    (filterApplied ? filteredEvents : events).map(event => (
                        <div key={event.id} className='event-card'>

                            <h3>{event.title}</h3>
                            {event.location && <p>{event.location.name}</p>}

                            <img src={event.image} alt={event.title} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }} />
                            
                            <p>{format(new Date(event.start_date), 'MMMM d, yyyy h:mm a')} - {format(new Date(event.end_date), 'MMMM d, yyyy h:mm a')}</p>
                            <p>{event.description.length > 100 ? `${event.description.substring(0, 100)}...` : event.description}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
export default Events
