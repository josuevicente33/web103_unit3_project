export const getAllEvents = async () => {
    try {
        const response = await fetch('/api/events');
        return await response.json();
    } catch (error) {
        console.error('Error fetching events:', error);
    }
};

export const getEventById = async (id) => {
    try {
        const response = await fetch(`/api/events/${id}`);
        return await response.json();
    } catch (error) {
        console.error(`Error fetching event with ID ${id}:`, error);
    }
};
export const getEventsByDateRange = async (startDate, endDate) => {
    try {
        const response = await fetch(`/api/events/date-range?startDate=${startDate}&endDate=${endDate}`);
        return await response.json();
    } catch (error) {
        console.error(`Error fetching events between ${startDate} and ${endDate}:`, error);
    }
};

export const createEvent = async (eventData) => {
    try {
        const response = await fetch('/api/events', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
    });
    return await response.json();
    } catch (error) {
        console.error('Error creating event:', error);
    }
}; 

export default { getAllEvents, getEventById, getEventsByDateRange, createEvent };