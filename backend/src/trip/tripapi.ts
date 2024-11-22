import express, { Express, Request, Response } from 'express';
import path from 'path';
import "dotenv/config";
import bodyParser from 'body-parser';
import { db } from '../drizzle/db';
import { TripTable, DestinationTable } from '../drizzle/schema';
import { eq, and, or, like, sql} from "drizzle-orm";
import cors from 'cors';
import { tripSchema, destinationSchema } from '../drizzle/validationSchemas';
import moment from 'moment';

export interface TripTable {
    id: number;
    name: string;
    description: string;
    images: string[];
    start_date: Date;
    end_date: Date;
    participants: number;
    finances?: number;
}

export async function startTrip(app: Express) {
    try {
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(cors());
        app.use('/pictures', express.static(path.join(__dirname, '../pictures')));

        function calculateTotalCost(trip: any): number {
            let totalCost = 0;
            
            if (trip.finances && trip.finances.cost) {
                totalCost += trip.finances.cost;
            }
            return totalCost;
        }

        // Show all trips
        app.get('/api/trips', async (req: Request, res: Response) => {
            try {
                const trips = await db.select().from(TripTable);
                const destinations = await db.select().from(DestinationTable);

                const tripsWithDestinations = trips.map((trip: any) => {
                    const tripDestinations = destinations.filter((destination: any) => destination.trip_id === trip.id);
                    trip.destinations = tripDestinations;
                    trip.total_cost = calculateTotalCost(trip);
                    return trip;
                });

                res.json(tripsWithDestinations);
            } catch (error) {
                console.error('Error fetching trips:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
        //search name or Date
        app.get('/api/trips/search', async (req: Request, res: Response) => {
            try {
              const { query } = req.query;
              if (!query || typeof query !== 'string') {
                return res.status(400).json({ message: 'Invalid query parameter' });
              }
          
              const lowerQuery = query.toLowerCase();
              const likeQuery = `%${lowerQuery}%`;
          
              // Try to parse the query as a date in multiple formats
              const dateFormats = ['YYYY-MM-DD', 'YYYY-MM', 'YYYY', 'DD.MM.YYYY', 'DD.MM.YY', 'DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY'];
              let dateQuery: string | null = null;
              
              for (const format of dateFormats) {
                if (moment(query, format, true).isValid()) {
                  dateQuery = moment(query, format).format('YYYY-MM-DD');
                  break;
                }
              }
          
              const trips = await db
                .select()
                .from(TripTable)
                .where(
                  or(
                    sql`LOWER(${TripTable.name}) LIKE ${likeQuery}`,
                    sql`to_char(${TripTable.start_date}, 'YYYY-MM-DD') ILIKE ${likeQuery}`,
                    sql`to_char(${TripTable.end_date}, 'YYYY-MM-DD') ILIKE ${likeQuery}`,
                    dateQuery ? sql`to_char(${TripTable.start_date}, 'YYYY-MM-DD') LIKE ${`%${dateQuery}%`}` : sql`1=0`,
                    dateQuery ? sql`to_char(${TripTable.end_date}, 'YYYY-MM-DD') LIKE ${`%${dateQuery}%`}` : sql`1=0`
                  )
                );
                const destinationTrips = await db
                .select({
                    trip: TripTable,
                    destination: DestinationTable
                })
                .from(DestinationTable)
                .innerJoin(TripTable, sql`${DestinationTable.trip_id} = ${TripTable.id}`)
                .where(
                    or(
                        sql`LOWER(${DestinationTable.name}) LIKE ${likeQuery}`,
                        sql`to_char(${DestinationTable.date}, 'YYYY-MM-DD') ILIKE ${likeQuery}`,
                        dateQuery ? sql`to_char(${DestinationTable.date}, 'YYYY-MM-DD') LIKE ${`%${dateQuery}%`}` : sql`1=0`
                    )
                );
                
                const combinedTrips = [
                    ...trips,
                    ...destinationTrips.map(dt => dt.trip)
                ].filter((trip, index, self) => 
                    index === self.findIndex(t => t.id === trip.id)
                );
              res.json(combinedTrips);
            } catch (error) {
              console.error('Error fetching trips:', error);
              res.status(500).json({ message: 'Internal server error' });
            }
          });
        // Show only one trip
        app.get('/api/trips/:id', async (req: Request, res: Response) => {
            try {
                const tripId = parseInt(req.params.id, 10);
                if (isNaN(tripId)) {
                    return res.status(400).json({ message: 'Invalid trip ID' });
                }

                const trips = await db.select().from(TripTable).where(eq(TripTable.id, tripId)).limit(1);

                if (trips.length === 0) {
                    return res.status(404).json({ message: 'Trip not found' });
                }

                const destinations = await db.select().from(DestinationTable).where(eq(DestinationTable.trip_id, tripId));
                const tripWithDestinations = trips.map((trip: any) => {
                    const tripDestinations = destinations.filter((destination: any) => destination.trip_id === trip.id);
                    trip.destinations = tripDestinations;
                    trip.total_cost = calculateTotalCost(trip);
                    return trip;
                });

                res.json(tripWithDestinations[0]);
            } catch (error) {
                console.error('Error fetching trip:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        // Add 1 to n new destinations to a trip
        app.post('/api/dest', async (req, res) => {
            try {
                const destinations = req.body.destinations;
                const { trip_id } = req.body;

                if (!destinations || !Array.isArray(destinations)) {
                    return res.status(400).json({ message: 'Invalid request. Please provide an array of destinations.' });
                }
                
                for (const destination of destinations) {
                    destination.trip_id = trip_id;
                    destination.date = new Date(destination.date);

                    if (isNaN(destination.date.getTime())) {
                        return res.status(400).json({ message: 'Invalid date format' });
                    }
                    if (typeof destination.photos === 'string') {
                        destination.photos = [destination.photos];
                    }
                    await destinationSchema.validate(destination, {abortEarly: false}); 
                }

                const result = await db.insert(DestinationTable).values(destinations).returning({ id: DestinationTable.id }).execute();

                res.json({ message: 'Destinations added successfully', ids: result });
            } catch (error) {
                console.error('Error adding destinations:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        // Add new trip
        app.post('/api/trips', async (req, res) => {
            try {
                const { name, description, start_date, end_date, participants, images, finances } = req.body;
                console.log('Received data for new trip:', { name, description, start_date, end_date, participants, images, finances });
                const tripData = {
                    name,
                    description,
                    image: images,
                    start_date: new Date(start_date),
                    end_date: new Date(end_date),
                    participants,
                    finances
                };

                await tripSchema.validate(tripData, { abortEarly: false });

                
                const result = await db.insert(TripTable).values({
                    name,
                    description,
                    image: images.join(';'), // Store concatenated image URLs in the 'image' field
                    start_date: new Date(start_date),
                    end_date: new Date(end_date),
                    participants,
                    finances
                }).returning({
                    id: TripTable.id
                }).execute(); 

                const tripId = result[0]?.id;

                if (!tripId) {
                    throw new Error('Trip ID not returned from the database');
                }

                res.json({ message: 'Trip added successfully', id: tripId }); 
            } catch (error) {
                console.error('Error adding trip:', error);
                res.status(500).json('Internal server error');
            }
        });

        // Update trip with ID
        app.put('/api/trips/:id', async (req: Request, res: Response) => {
            try {
                const tripId = parseInt(req.params.id, 10);
                const { name, description, start_date, end_date, participants, images, finances } = req.body;

                console.log('Received data:', { name, description, start_date, end_date, participants, images, finances });

                const tripData = {
                    name,
                    description,
                    image: images,
                    start_date: new Date(start_date),
                    end_date: new Date(end_date),
                    participants,
                    finances
                };

                await tripSchema.validate(tripData, { abortEarly: false }); 

                const imageString = images.join(';');
                await db.update(TripTable).set({
                    name,
                    description,
                    image: imageString,
                    start_date: new Date(start_date),
                    end_date: new Date(end_date),
                    participants,
                    finances
                }).where(eq(TripTable.id, tripId));

                res.json({ message: 'Trip updated successfully' });
            } catch (error) {
                console.error('Error updating trip:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        // Delete trip with destinations and ID
        app.delete('/api/trips/:id', async (req: Request, res: Response) => {
            try {
                const tripId = parseInt(req.params.id, 10);

                await db.delete(DestinationTable).where(eq(DestinationTable.trip_id, tripId));
                await db.delete(TripTable).where(eq(TripTable.id, tripId));

                res.json({ message: 'Trip deleted successfully' });
            } catch (error) {
                console.error('Error deleting trip:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        // Delete a specific destination by trip ID and destination ID
        app.delete('/api/trips/:trip_id/destinations/:destination_id', async (req: Request, res: Response) => {
            try {
                const tripId = parseInt(req.params.trip_id, 10);
                const destinationId = parseInt(req.params.destination_id, 10);

                if (isNaN(tripId) || isNaN(destinationId)) {
                    return res.status(400).json({ message: 'Invalid trip ID or destination ID' });
                }

                await db.delete(DestinationTable)
                    .where(and(
                        eq(DestinationTable.id, destinationId),
                        eq(DestinationTable.trip_id, tripId)
                    ))
                    .execute();

                res.json({ message: 'Destination deleted successfully' });
            } catch (error) {
                console.error('Error deleting destination:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });

    } catch (error) {
        console.log(error);
    }
}
