import { v4 as uuidv4 } from 'uuid';
import { NewPlayer, Player } from './types';
import gameManager from './GameManager';
import { Socket } from 'socket.io';

export const createGame = (newPlayer: NewPlayer, socket: Socket) => {
    const player: Player = {
        id: uuidv4(),
        username: newPlayer.username,
        socket
    }
    const game = gameManager.createGame(player);
    return { game, player };
}

export const joinGame = (gameId: string, newPlayer: NewPlayer, socket: Socket) => {
    const player: Player = {
        id: uuidv4(),
        username: newPlayer.username,
        socket
    }
    gameManager.addPlayerToGame(gameId, player);
    const game = gameManager.getGame(gameId);
    return { game, player };
}

export const endGame = (gameId: string) => {
    gameManager.endGame(gameId);
}