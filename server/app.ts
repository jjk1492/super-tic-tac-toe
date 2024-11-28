import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import { handleSocketMessage } from './socketHandler';
import { playerDisconnected } from './gameService';

const app = express();
app.use(express.json());
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    }
});

const PORT = process.env.PORT || 5000;

io.on('connection', (socket) => {
    console.log('A client has connected');

    // Handle incoming events from clients
    socket.on('message', (data) => {
        console.log('Received message:', data);

        const parsedData = JSON.parse(data);
        handleSocketMessage(socket, parsedData);
    });

    socket.on('disconnect', () => {
        console.log('A client has disconnected');
        playerDisconnected(socket);
    });
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

export {};