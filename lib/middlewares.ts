// listenerMiddleware.ts
import { createListenerMiddleware, addListener } from '@reduxjs/toolkit'
import type { RootState, AppDispatch } from './store'
import { STTTGameActions, STTTGameSelectors } from '@/app/components/STTTGameSlice'
import { checkForGameEnd } from '@/app/helpers'

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
        const state = listenerApi.getState();
        const { row, col } = action.payload;

        const selectedBoardGame = STTTGameSelectors.getSelectedBoardGame(state);

        if (selectedBoardGame) {
            const isGameComplete = checkForGameEnd(selectedBoardGame);
            if (typeof isGameComplete === 'string') {
                if (isGameComplete === '') {
                    alert('It\'s a draw!');
                }
                alert(`Player ${isGameComplete} wins!`);
            }
        }

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
        if(!action.payload) {
            return;
        }

        const selectedBoardGame = STTTGameSelectors.getSingleGameBoard(action.payload)(state);
        
        if (typeof checkForGameEnd(selectedBoardGame) === 'string') {
            listenerApi.dispatch(STTTGameActions.selectBoard(null));
        }
    }
})