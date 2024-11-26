// listenerMiddleware.ts
import { createListenerMiddleware, addListener, ListenerEffectAPI, isAnyOf } from '@reduxjs/toolkit'
import type { RootState, AppDispatch } from './store'
import { STTTGameActions, STTTGameSelectors } from '@/app/components/STTTGameSlice'
import { checkForGameEnd } from '@/app/helpers'
import { MultiplayerActions, MultiplayerSelectors } from '@/app/multiplayer/state'
import { socket } from './socket'
import { Socket } from 'socket.io-client'

export const listenerMiddleware = createListenerMiddleware()

export const startAppListening = listenerMiddleware.startListening.withTypes<
    RootState,
    AppDispatch
>()

export const addAppListener = addListener.withTypes<RootState, AppDispatch>()

// Validate selected game
startAppListening({
    actionCreator: STTTGameActions.selectBoard,
    effect: (action, listenerApi) => {
        const state = listenerApi.getState();
        if (!action.payload) {
            return;
        }

        const selectedBoardGame = STTTGameSelectors.getSingleGameBoard(action.payload)(state);

        if (typeof checkForGameEnd(selectedBoardGame) === 'string') {
            listenerApi.dispatch(STTTGameActions.selectBoard(null));
        }
    }
})

const isCellClaimAction = isAnyOf(STTTGameActions.cellClaimed, STTTGameActions.claimCell)
// Check for entire game completion
startAppListening({
    matcher: isCellClaimAction,
    effect: (action, listenerApi) => {
        const { row, col } = action.payload;
        // switch players
        listenerApi.dispatch(STTTGameActions.switchPlayer());

        // set the next game board
        const nextGameBoard = { row, col };
        listenerApi.dispatch(STTTGameActions.selectBoard(nextGameBoard));

        const state = listenerApi.getState();
        const gameBoard = STTTGameSelectors.getSuperGameBoard(state);
        const solvedGameBoard = gameBoard.map(row => row.map(cell => checkForGameEnd(cell)));

        const winner = checkForGameEnd(solvedGameBoard);
        if (typeof winner === 'string') {
            listenerApi.dispatch(STTTGameActions.gameOver(winner));
        }
    }
});


type WebSocketMessage = {
    type: string;
    payload: any;
};

const initializeGameConnectionListeners = (socket: Socket, listenerApi: ListenerEffectAPI<RootState, AppDispatch>) => {
    const state = listenerApi.getState();
    const currentPlayer = MultiplayerSelectors.getLoggedInPlayer(state);

    if (!currentPlayer) {
        return;
    }

    socket.on('message', (dirtyMessage: string) => {
        const message: WebSocketMessage = JSON.parse(dirtyMessage);
        console.log('Received message:', message);
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
                    id: message.payload.playerId,
                    username: message.payload.username
                }));
                break;
            default:
                console.log('Unknown message type:', message.type);
        }
    });
};

// create websocket connection when multiplayer game is created
startAppListening({
    actionCreator: MultiplayerActions.createGame,
    effect: (action, listenerApi) => {
        const state = listenerApi.getState();
        const currentPlayer = MultiplayerSelectors.getLoggedInPlayer(state);
        const gameID = MultiplayerSelectors.getGameId(state);
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
        const state = listenerApi.getState();
        const currentPlayer = MultiplayerSelectors.getLoggedInPlayer(state);
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
        const state = listenerApi.getOriginalState();
        const currentPlayer = MultiplayerSelectors.getLoggedInPlayer(state);
        const gameId = MultiplayerSelectors.getGameId(state);
        const board = STTTGameSelectors.getSelectedBoard(state);

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
