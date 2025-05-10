import { STTTGameActions, STTTGameSelectors } from "@/app/components/STTTGameSlice";
import { checkForGameEnd } from "@/app/helpers";
import { isAnyOf } from "@reduxjs/toolkit";

import { selectCurrentState, startAppListening } from "../root";

const startGameListeners = () => {
/********** VALIDATE SELECTED GAME **********/
startAppListening({
    actionCreator: STTTGameActions.selectBoard,
    effect: (action, listenerApi) => {
        const select = selectCurrentState(listenerApi);
        if (!action.payload) {
            return;
        }

        const selectedBoardGame = select(STTTGameSelectors.getSingleGameBoard(action.payload));

        if (typeof checkForGameEnd(selectedBoardGame) === 'string') {
            listenerApi.dispatch(STTTGameActions.selectBoard(null));
        }
    }
})

/********** CHECK FOR GAME COMPLETED **********/
const isCellClaimAction = isAnyOf(STTTGameActions.cellClaimed, STTTGameActions.claimCell)
startAppListening({
    matcher: isCellClaimAction,
    effect: (action, listenerApi) => {
        const { row, col } = action.payload;
        const select = selectCurrentState(listenerApi);
        // switch players
        listenerApi.dispatch(STTTGameActions.switchPlayer());

        // set the next game board
        const nextGameBoard = { row, col };
        listenerApi.dispatch(STTTGameActions.selectBoard(nextGameBoard));

        const gameBoard = select(STTTGameSelectors.getSuperGameBoard);
        const solvedGameBoard = gameBoard.map(row => row.map(cell => checkForGameEnd(cell)));

        const winner = checkForGameEnd(solvedGameBoard);
        if (typeof winner === 'string') {
            listenerApi.dispatch(STTTGameActions.gameOver(winner));
        }
    }
});
};

export default startGameListeners;