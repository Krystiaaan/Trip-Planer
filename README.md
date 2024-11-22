# FWE-SS-24-765219 Trip App

MY FIRST PROJECT


Trip planning project that allows users to plan and organize trips and destinations easily and efficiently. The project includes both a frontend and a backend with a custom-built REST API.

## Table of Contents

1. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
2. [Running the Application](#running-the-application)
3. [API Endpoints](#api-endpoints)
   - [Trips](#trips)
   - [Destinations](#destinations)
4. [Backend Tests](#backend-tests)
5. [Bonus Features](#bonus-features)
6. [Technologies](#technologies)
7. [Authors-Note](#authors-note)
8. [Authors](#authors)
9. [License](#license)

## Getting Started

### Prerequisites

- Node.js
- npm
- PostgreSQL database

### Installation

1. **Clone the repository**

```bash
git clone https://code.fbi.h-da.de/istkrsadl/fwe-ss-24-765219.git
cd FWE-SS-24-765219
```
2. **Install dependencies** for both backend and frontend
```bash
npm install
```

3. **Configure environment variables**

Create a ´.env´ file in the backend directory and add the necessary environment variables:

```env
DATABASE_URL=postgres://user:password@localhost:5433/database
PORT=3000
```

4. **Migrate the database**

Ensure the PostgreSQL database is running and migrate the database:

```bash
npm run db:migrate
```

## Running the Application

- **Start the backend**
```bash
npm run dev
```

- **Start the frontend**
```bash
npm run dev
```

The application is now accessible at `http://localhost:5173`.

## API Endpoints

### Trips

- **Get all trips**
```http
GET /api/trips
```

- **Get a trip by ID**
```http
GET /api/trips/:id
```

- **Search for trips** 

Name, Destination or Date
```http
GET /api/trips/search?query=<search_term>
```

- **Add a new trip**

```http
POST /api/trips
```

```json
{
  "name": "Summer Vacation",
  "description": "A fun summer vacation with family.",
  "start_date": "2023-07-01T00:00:00Z",
  "end_date": "2023-07-15T00:00:00Z",
  "participants": 4,
  "images": [
    "https://example.com/photo1.jpg",
    "https://example.com/photo2.jpg"
  ],
  "finances": {
    "budget": 2000,
    "expenses": [
      { "item": "Flights", "cost": 500 },
      { "item": "Hotel", "cost": 800 },
      { "item": "Food", "cost": 300 }
    ]
  }
}
```

- **Update a trip**

```http
PUT /api/trips/:id
```

```json
{
  "name": "Updated Summer Vacation",
  "description": "An updated description for the summer vacation.",
  "start_date": "2023-07-01T00:00:00Z",
  "end_date": "2023-07-20T00:00:00Z",
  "participants": 5,
  "images": [
    "https://example.com/photo1_updated.jpg",
    "https://example.com/photo2_updated.jpg"
  ],
  "finances": {
    "budget": 2500,
    "expenses": [
      { "item": "Flights", "cost": 600 },
      { "item": "Hotel", "cost": 1000 },
      { "item": "Food", "cost": 400 }
    ]
  }
}
```

- **Delete a trip**

```http
DELETE /api/trips/:id
```
### Destinations

- **Add new destinations**

```http
POST /api/dest
```

```json
{
  "trip_id": 278,
  "destinations": [
    {
      "name": "Berlin",
      "description": "A visit to Berlin.",
      "date": "2023-06-01T00:00:00Z",
      "activities": "Sightseeing, Museum visit",
      "photos": [
        "https://example.com/photo1.jpg",
        "https://example.com/photo2.jpg"
      ]
    },
    {
      "name": "Paris",
      "description": "Exploring Paris.",
      "date": "2023-06-05T00:00:00Z",
      "activities": "Eiffel Tower, Louvre",
      "photos": [
        "https://example.com/photo3.jpg",
        "https://example.com/photo4.jpg"
      ]
    }
  ]
}
```

- **Delete a destination**
```http
DELETE /api/trips/:trip_id/destinations/:destination_id
```
## Backend Tests
1. **Postman Tests**
In the `backend/src/trip/` directory, there is a Postman collection 
(`FWE Hausaufgabe.postman_collection.json`) containing tests for the API endpoints. 
You can import this collection into Postman to manually run and verify the API functionality.

2. **Automated Tests with JEST**
Automated tests are written using JEST: These tests cover various API endpoints and functionalities to ensure the backend is working correctly.

```bash
npm run test
```
## Bonus Features
- **Freestyle task 1: Budget and Finances**
This feature allows users to manage the budget and finances for a trip. Users can set a Budget for a trip and add expenses.
The budget and expenses information can be viewed by accessing the specifit trip details.
- **Set a Budget and Add Expenses**
You can set a budget for a trip and the add expenses. For example:
- **Budget**: 500€
- **Expenses**: 
    -**Title**: Hotel 
    -**Amount**:250€

- **View Budget and Expenses**
You can view the budget and expenses information by selecting a specific trip and pressing the "Show Trip" button. This will display all the details about the trip, including the budget and expenses.


## Technologies

- Node.js
- Express
- PostgreSQL
- React
- Drizzle ORM

## Author's Note
I had already developed some basic backend skills to build a REST API, but I was totally new to React and frontend development when I started this project. It was a fun project with a lot of challenges, and I'm looking forward to starting the big project next.

I personally think web development in this form is very enjoyable, and I want to continue learning React and Node.js because of this course. Maybe this app isn't the best, but I learned a lot, and I hope to use this knowledge in the big project.

Thank you for using the Trip App, and I hope it helps make your travel planning easier and more enjoyable!

## Authors

- [Krystian](https://code.fbi.h-da.de/istkrsadl)

## License

MIT &copy; Krystian