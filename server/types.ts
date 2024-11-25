import { Socket } from "socket.io";

export type Player = {
    id: string;
    username: string;
    socket: Socket;
};

export type NewPlayer = Pick<Player, 'username'>;

export type Game = {
    id: string;
    players: Player[];
}