export const getAllLocations = async () => {
    const response = await fetch('/api/locations');
    return response.json();
};
export const getLocationById = async (id) => {
    const response = await fetch(`/api/locations/${id}`);
    return response.json();
};
export const createLocation = async (locationData) => {
    const response = await fetch('/api/locations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(locationData)
    });
    return response.json();
};

export default { getAllLocations, getLocationById, createLocation };
