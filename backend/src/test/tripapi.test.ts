import { describe, expect, it, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { startTrip } from '../trip/tripapi';

const app = express();
startTrip(app);

let testTripId: any;
let testDestinationId: any;

describe('Trip API', () => {

  it('should add a new trip', async () => {
    const newTrip = {
      name: 'Test Trip',
      description: 'A test trip description',
      start_date: '2023-06-01',
      end_date: '2023-06-10',
      participants: 5,
      images: [
        'https://www.moon.com/wp-content/uploads/2020/03/Santorini.png',
        'https://www.moon.com/wp-content/uploads/2020/03/Santorini.png'
      ]
    };
    const response = await request(app).post('/api/trips').send(newTrip);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Trip added successfully');
    expect(response.body).toHaveProperty('id');
    testTripId = response.body.id;
  });

  it('should fetch all trips', async () => {
    const response = await request(app).get('/api/trips');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should fetch a single trip by ID', async () => {
    const response = await request(app).get(`/api/trips/${testTripId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', testTripId);
  });

  it('should search trips by name or date', async () => {
    const response = await request(app).get('/api/trips/search').query({ query: 'Test Trip' });
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
  it('should update a trip by ID', async () => {
    const updatedTrip = {
      name: 'Updated Test Trip',
      description: 'An updated test trip description',
      start_date: '2023-06-01',
      end_date: '2023-06-15',
      participants: 10,
      images: [
        'https://www.moon.com/wp-content/uploads/2020/03/Santorini.png',
        'https://www.moon.com/wp-content/uploads/2020/03/Santorini.png',
        'https://www.moon.com/wp-content/uploads/2020/03/Santorini.png'
      ]
    };
    const response = await request(app).put(`/api/trips/${testTripId}`).send(updatedTrip);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Trip updated successfully');
  });

  it('should add destinations to a trip', async () => {
    const newDestinations = [
      {
        name: 'Temporary Destination',
        description: 'A sample description',
        date: '2023-06-01',
        activities: 'Sample activities',
        photos: [
          'https://cdn.adventure-life.com/96/91/7/ThinkstockPhotos-510081860/1300x820.webp'
        ],
      }
    ];

    const payload = {
      trip_id: testTripId,
      destinations: newDestinations,
    };

    //console.log(payload);
    const addResponse = await request(app).post('/api/dest').send(payload);
    expect(addResponse.status).toBe(200);
    //console.log(addResponse.body);
    expect(addResponse.body).toHaveProperty('message', 'Destinations added successfully');
    expect(addResponse.body).toHaveProperty('ids');
    testDestinationId = addResponse.body.ids[0].id;
    //console.log(testDestinationId);
  });

  it('should delete a destination by trip ID and destination ID', async () => {
    console.log(testDestinationId);
    const response = await request(app).delete(`/api/trips/${testTripId}/destinations/${testDestinationId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Destination deleted successfully');
  });

  it('should delete a trip by ID', async () => {
    const response = await request(app).delete(`/api/trips/${testTripId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Trip deleted successfully');
  });
});