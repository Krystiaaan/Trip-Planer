import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

// Fetch all trips
export const fetchTrips = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/trips`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trips:", error);
    throw error;
  }
};

// Fetch a single trip by ID
export const fetchTripById = async (id: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/trips/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trip:", error);
    throw error;
  }
};

// Add a new trip
export const addTrip = async (tripData: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/trips`, tripData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding trip:", error);
    throw error;
  }
};

// Update a trip by ID
export const updateTrip = async (id: number, updatedTrip: any) => {
  try {
    console.log("Updating trip:", id, updatedTrip);
    await axios.put(`${API_BASE_URL}/trips/${id}`, updatedTrip, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating trip:", error);
    throw error;
  }
};

// Delete a trip by ID
export const deleteTrip = async (id: number) => {
  try {
    await axios.delete(`${API_BASE_URL}/trips/${id}`);
  } catch (error) {
    console.error("Error deleting trip:", error);
    throw error;
  }
};

// Add destinations to a trip
export const addDestinations = async (tripId: number, destinations: any[]) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/dest`, {
      trip_id: tripId,
      destinations,
    }, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding destinations:", error);
    throw error;
  }
};

// Delete a destination by trip ID and destination ID
export const deleteDestination = async (tripId: number, destinationId: number) => {
  try {
    await axios.delete(`${API_BASE_URL}/trips/${tripId}/destinations/${destinationId}`);
  } catch (error) {
    console.error("Error deleting destination:", error);
    throw error;
  }
};
