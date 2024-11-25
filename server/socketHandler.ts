import { Socket } from "socket.io";
import * as GameService from "./gameService";

type CreateGame = {
    type: 'create_game';
    payload: {
        username: string;
    }
}
type JoinGame = {
    type: 'join_game';
    payload: {
        gameId: string;
        username: string;
    }
};
type AnyMessage = {
    type: string;
    payload: any;
}

export function handleSocketMessage(socket: Socket, message: CreateGame | AnyMessage) {
    switch (message.type) {
        case 'create_game': {
            console.log('Creating game with username:', message.payload.username);
            const { game, player } = GameService.createGame({ username: message.payload.username }, socket);
            console.log('Game created:', game);

            socket.send(JSON.stringify({
                type: 'game_created',
                payload: {
                    gameId: game.id,
                    playerId: player.id
                }
            }));
            return;
        }
        case 'join_game': {
            console.log('Joining game with username:', message.payload.username);
            try {
                const { game, player } = GameService.joinGame(message.payload.gameId, { username: message.payload.username }, socket);
                console.log('Game joined:', game.id);
                socket.send(JSON.stringify({
                    type: 'game_joined',
                    payload: {
                        gameId: game.id,
                        playerId: player.id
                    }
                }));
                game.players[0].socket.send(JSON.stringify({
                    type: 'player_joined',
                    payload: {
                        playerId: player.id,
                        username: player.username
                    }
                }));
            } catch (e) {
                console.error('Error joining game', e);
                socket.send(JSON.stringify({
                    type: 'error',
                    payload: {
                        originalAction: 'join_game',
                    }
                }));
            }
            break;
        }
        default:
            console.log('Unknown message type:', message.type);
    }

}