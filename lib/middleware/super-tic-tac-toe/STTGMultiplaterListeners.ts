import { STTTGameActions, STTTGameSelectors } from '@/app/components/STTTGameSlice'
import { MultiplayerActions, MultiplayerSelectors } from '@/app/multiplayer/state'
import { ListenerEffectAPI } from '@reduxjs/toolkit'
import { Socket } from 'socket.io-client'
import { socket } from '../../socket'
import type { AppDispatch, RootState } from '../../store'
import { selectCurrentState, selectOriginalState, startAppListening } from '../root'



type WebSocketMessage = {
    type: string;
    payload: any;
};

const initializeGameConnectionListeners = (socket: Socket, listenerApi: ListenerEffectAPI<RootState, AppDispatch>) => {
    const select = selectCurrentState(listenerApi);
    const currentPlayer = select(MultiplayerSelectors.getLoggedInPlayer);

    if (!currentPlayer) {
        return;
    }

    socket.on('message', (dirtyMessage: string) => {
        const message: WebSocketMessage = JSON.parse(dirtyMessage);
        console.log('Received websocket message:', message);
        switch (message.type) {
            case 'game_created':
                listenerApi.dispatch(MultiplayerActions.connectionEstablished({
                    player: {
                        id: message.payload.playerId,
                        username: currentPlayer.username
                    },
                    gameId: message.payload.gameId
                }));
                break;
            case 'game_joined':
                listenerApi.dispatch(MultiplayerActions.connectionEstablished({
                    player: {
                        id: message.payload.playerId,
                        username: currentPlayer.username
                    },
                    gameId: message.payload.gameId
                }));
                if (message.payload.opponent.id) {
                    listenerApi.dispatch(MultiplayerActions.playerConnected({
                        id: message.payload.opponent.id,
                        username: message.payload.opponent.username
                    }));
                }
                break;
            case 'turn_taken':
                listenerApi.dispatch(STTTGameActions.selectBoard({
                    row: message.payload.board.row,
                    col: message.payload.board.col
                }));
                listenerApi.dispatch(STTTGameActions.cellClaimed({
                    row: message.payload.cell.row,
                    col: message.payload.cell.col
                }));
                break;
            case 'player_joined':
                listenerApi.dispatch(MultiplayerActions.playerConnected({
                    id: message.payload.id,
                    username: message.payload.username
                }));
                break;
            case 'message_received':
                listenerApi.dispatch(MultiplayerActions.messageReceived({
                    sender: message.payload.sender,
                    message: message.payload.message
                }));
                break;
            case 'player_left':
                listenerApi.dispatch(MultiplayerActions.playerDisconnected(message.payload.player));
                break;
            default:
                console.log('Unknown message type:', message.type);
        }
    });
};

const startMultiplayerListeners = () => {
    // create websocket connection when multiplayer game is created
    startAppListening({
        actionCreator: MultiplayerActions.createGame,
        effect: (action, listenerApi) => {
            const select = selectCurrentState(listenerApi);

            const currentPlayer = select(MultiplayerSelectors.getLoggedInPlayer);
            const gameID = select(MultiplayerSelectors.getGameId);

            if (!currentPlayer) {
                return;
            }
            initializeGameConnectionListeners(socket, listenerApi);

            socket.send(JSON.stringify({
                type: 'create_game',
                payload: {
                    gameID,
                    username: currentPlayer.username
                }
            }));
        }
    });

    // create websocket connection when multiplayer game is joined
    startAppListening({
        actionCreator: MultiplayerActions.joinGame,
        effect: (action, listenerApi) => {
            const select = selectCurrentState(listenerApi);

            const currentPlayer = select(MultiplayerSelectors.getLoggedInPlayer);
            const gameId = action.payload.gameId;

            if (!currentPlayer) {
                return;
            }
            initializeGameConnectionListeners(socket, listenerApi);

            socket.send(JSON.stringify({
                type: 'join_game',
                payload: {
                    gameId,
                    username: currentPlayer.username
                }
            }));
        }
    });

    startAppListening({
        actionCreator: STTTGameActions.claimCell,
        effect: (action, listenerApi) => {
            const selectOriginal = selectOriginalState(listenerApi);

            const currentPlayer = selectOriginal(MultiplayerSelectors.getLoggedInPlayer);
            const gameId = selectOriginal(MultiplayerSelectors.getGameId);
            const board = selectOriginal(STTTGameSelectors.getSelectedBoard);

            if (!currentPlayer) {
                return;
            }

            socket.send(JSON.stringify({
                type: 'turn_taken',
                payload: {
                    gameId,
                    playerId: currentPlayer.id,
                    board,
                    cell: action.payload
                }
            }));
        }
    });

    startAppListening({
        actionCreator: MultiplayerActions.sendMessage,
        effect: (action) => {
            socket.send(JSON.stringify({
                type: 'send_message',
                payload: {
                    message: action.payload
                }
            }));
        }
    })
};

export default startMultiplayerListeners;