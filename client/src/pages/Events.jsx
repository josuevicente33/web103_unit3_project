// display all events
import React, { useEffect, useState } from 'react'
import EventsAPI from '../services/EventsAPI'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'

const Events = () => {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [dateRange, setDateRange] = useState({startDate: '', endDate: ''})
    const [filteredEvents, setFilteredEvents] = useState([])
    const [filterApplied, setFilterApplied] = useState(false)

    useEffect(() => {
        (async () => {
            try {
                const eventsData = await EventsAPI.getAllEvents()
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

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setDateRange(prevState => ({ ...prevState, [name]: value }))
    }
    const handleFilterSubmit = async (e) => {
        e.preventDefault()
        if (!dateRange.startDate || !dateRange.endDate) {
            setError('Please select both start and end dates.')
            return
        }
        try {
            const eventsData = await EventsAPI.getEventsByDateRange(dateRange.startDate, dateRange.endDate)
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
    if (loading) return <div className='loading'>Loading events...</div>
    if (error) return <div className='error'>{error}</div>
    return (
        <div className='flex-column events-page'>
            <div>
                <h1>Upcoming Events</h1>
                <Link to="/">Home</Link>
            </div>
            <form className='date-filter-form' onSubmit={handleFilterSubmit}>
                <label>
                    Start Date:
                    <input type='date' name='startDate' value={dateRange.startDate} onChange={handleInputChange} />
                </label>
                <label>
                    End Date:
                    <input type='date' name='endDate' value={dateRange.endDate} onChange={handleInputChange} />
                </label>
                <button type='submit'>Filter</button>
                {filterApplied && <button type='button' onClick={clearFilter}>Clear Filter</button>}
            </form>
            <div className='events-list'>
                {(filterApplied ? filteredEvents : events).length === 0 ? (
                    <p>No events found for the selected date range.</p>
                ) : (
                    (filterApplied ? filteredEvents : events).map(event => (
                        <div key={event.id} className='event-card'>
                            <img src={eventImage} alt={event.name} />
                            <h2>{event.name}</h2>
                            <p>{format(new Date(event.start_date), 'MMMM d, yyyy h:mm a')} - {format(new Date(event.end_date), 'MMMM d, yyyy h:mm a')}</p>
                            <p>{event.description.length > 100 ? `${event.description.substring(0, 100)}...` : event.description}</p>
                            <Link to={`/events/${event.id}`}>View Details</Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
export default Events
