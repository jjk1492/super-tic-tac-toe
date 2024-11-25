// listenerMiddleware.ts
import { createListenerMiddleware, addListener } from '@reduxjs/toolkit'
import type { RootState, AppDispatch } from './store'
import { STTTGameActions, STTTGameSelectors } from '@/app/components/STTTGameSlice'
import { checkForGameEnd } from '@/app/helpers'
import { MultiplayerActions, MultiplayerSelectors } from '@/app/multiplayer/state'
import { socket } from './socket'

export const listenerMiddleware = createListenerMiddleware()

export const startAppListening = listenerMiddleware.startListening.withTypes<
    RootState,
    AppDispatch
>()

export const addAppListener = addListener.withTypes<RootState, AppDispatch>()

// Check for game completion
startAppListening({
    actionCreator: STTTGameActions.claimCell,
    effect: (action, listenerApi) => {
        const { row, col } = action.payload;
        // switch players
        listenerApi.dispatch(STTTGameActions.switchPlayer());

        // set the next game board
        const nextGameBoard = { row, col };
        listenerApi.dispatch(STTTGameActions.selectBoard(nextGameBoard));
    }
})

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

// Check for entire game completion
startAppListening({
    actionCreator: STTTGameActions.claimCell,
    effect: (action, listenerApi) => {
        const state = listenerApi.getState();
        const gameBoard = STTTGameSelectors.getSuperGameBoard(state);
        const solvedGameBoard = gameBoard.map(row => row.map(cell => checkForGameEnd(cell)));

        const winner = checkForGameEnd(solvedGameBoard);
        if (typeof winner === 'string') {
            listenerApi.dispatch(STTTGameActions.gameOver(winner));
        }
    }
});

// create websocket connection when multiplayer game is created
startAppListening({
    actionCreator: MultiplayerActions.createGame,
    effect: (action, listenerApi) => {
        const state = listenerApi.getState();
        const currentPlayer = MultiplayerSelectors.getCurrentPlayer(state);
        const gameID = MultiplayerSelectors.getGameId(state);
        if (!currentPlayer) {
            return;
        }

        socket.on('message', (message) => {
            console.log('Received message:', message);
            const parsedMessage = JSON.parse(message);
            const { type, payload } = parsedMessage;
            switch (type) {
                case 'game_created':
                    listenerApi.dispatch(MultiplayerActions.connectionEstablished({
                        player: {
                            id: payload.playerId,
                            username: currentPlayer.username
                        },
                        gameId: payload.gameId
                    }));
                    break;
                case 'game_joined':
                    listenerApi.dispatch(MultiplayerActions.connectionEstablished({
                        player: {
                            id: payload.playerId,
                            username: currentPlayer.username
                        },
                        gameId: payload.gameId
                    }));
                    break;
                case 'player_joined':
                    listenerApi.dispatch(MultiplayerActions.playerConnected({
                        id: payload.playerId,
                        username: payload.username
                    }));
                    break;
                default:
                    console.log('Unknown message type:', type);
            }
        });

        socket.send(JSON.stringify({
            type: 'create_game',
            payload: {
                gameID,
                username: currentPlayer.username
            }
        }));
    }
});
