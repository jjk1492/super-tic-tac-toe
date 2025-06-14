import { Socket } from "socket.io";
import * as GameService from "./gameService";
import { WebSocketMessage } from "./types";

// only responsible for sending messages to the specific socket that sent the message
export function handleSocketMessage(socket: Socket, message: WebSocketMessage) {
    switch (message.type) {
        case 'create_game': {
            const { game, player } = GameService.createGame({ username: message.payload.username }, socket);

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
            try {
                const { game, player } = GameService.joinGame(message.payload.gameId, { username: message.payload.username }, socket);
                const opponent = GameService.getOpponent(player.id, game.id);

                socket.send(JSON.stringify({
                    type: 'game_joined',
                    payload: {
                        gameId: game.id,
                        playerId: player.id,
                        opponent: {
                            id: opponent?.id,
                            username: opponent?.username
                        }
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
        case 'turn_taken': {
            console.log('Turn taken by player', message);
            GameService.takeTurn(message.payload.gameId, message.payload.playerId, message.payload.board, message.payload.cell);
            break;
        }
        case 'send_message': {
            GameService.sendMessage(socket.data.gameId, socket.data.playerId, message.payload.message);
            break;
        }
        default:
            console.log('Unknown message type:', message.type);
    }

}