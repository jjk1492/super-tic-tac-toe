import { io } from "socket.io-client";

const getUrl = () => {
    return 'localhost:5000';
};

export const socket = io(getUrl());
