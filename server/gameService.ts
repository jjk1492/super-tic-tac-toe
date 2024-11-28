import { v4 as uuidv4 } from 'uuid';
import { CellIdentifier, NewPlayer, Player, TicTacToeTeams } from './types';
import gameManager from './GameManager';
import { Socket } from 'socket.io';

export const removeBackendOnlyFields = (player: Player) => {
    const { socket, ...fePlayer } = player;
    return fePlayer;
}

export const createGame = (newPlayer: NewPlayer, socket: Socket) => {
    const player: Player = {
        id: uuidv4(),
        username: newPlayer.username,
        socket,
        team: TicTacToeTeams.X
    }
    const game = gameManager.createGame(player);
    socket.data.gameId = game.id;
    socket.data.playerId = player.id;
    return { game, player };
}

export const joinGame = (gameId: string, newPlayer: NewPlayer, socket: Socket) => {
    const player: Player = {
        id: uuidv4(),
        username: newPlayer.username,
        socket,
        team: TicTacToeTeams.O
    }
    socket.data.gameId = gameId;
    socket.data.playerId = player.id;
    gameManager.addPlayerToGame(gameId, player);
    const game = gameManager.getGame(gameId);

    if (!game) {
        throw new Error('Game not found');
    }
    // Notify the opponent that a new player has joined
    const opponent = game.players[0];
    opponent.socket.send(JSON.stringify({
        type: 'player_joined',
        payload: removeBackendOnlyFields(player)
    }));
    return { game, player };
}

export const takeTurn = (gameId: string, playerId: string, board: CellIdentifier, cell: CellIdentifier) => {
    const opponent = getOpponent(playerId, gameId);
    if (!opponent) {
        throw new Error('Player not found');
    }
    opponent.socket.send(JSON.stringify({
        type: 'turn_taken',
        payload: {
            gameId,
            cell,
            board
        }
    }));
}

export const getOpponent = (playerId: string, gameId: string) => {
    const game = gameManager.getGame(gameId);

    return game?.players.find(player => player.id !== playerId);
}

export const endGame = (gameId: string) => {
    gameManager.endGame(gameId);
}

export const getPlayer = (id: string, gameId: string) => {
    return gameManager.getPlayer(id, gameId);
}

/**
 * Removes a player from the game and notifies the opponent
 */
export const playerDisconnected = (socket: Socket) => {
    const { playerId, gameId } = socket.data;
    const player = getPlayer(playerId, gameId);
    const opponent = getOpponent(playerId, gameId);

    if (player) {
        gameManager.removePlayerFromGame(playerId, gameId);

        if (opponent) {
            opponent.socket.send(JSON.stringify({
                type: 'player_left',
                payload: {
                    gameId,
                    player: player ? removeBackendOnlyFields(player) : undefined
                }
            }));
        }
    }
}

export const sendMessage = (gameId: string, playerId: string, message: string) => {
    const opponent = getOpponent(playerId, gameId);
    if (!opponent) {
        throw new Error('Player not found');
    }
    opponent.socket.send(JSON.stringify({
        type: 'message_received',
        payload: {
            sender: {
                id: playerId,
                username: getPlayer(playerId, gameId)?.username
            },
            message
        }
    }));
}