import "dotenv/config";
import {startTrip} from './trip/tripapi'
import express from 'express';
import http from 'http';


async function startServer() {
    try {
        const app = express();

        await startTrip(app);

        const server = http.createServer(app);
        const PORT = process.env.PORT || 3000;
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }

}

startServer();