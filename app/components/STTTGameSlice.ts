import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AllPlayers, PLAYER_EMPTY, SingleGameBoard, CellIdentifier, PLAYER_X, PLAYER_O, GameType, GamePlayers } from "../constants"
import { buildSuperGameBoard, isValidCell } from "../helpers";
import { RootState } from "@/lib/store";

export type STTTGameSliceState = {
    boards: SingleGameBoard[][]; // 3x3 array of 3x3 boards
    currentPlayer: AllPlayers;
    selectedBoard: { row: number, col: number } | null;
    winner: AllPlayers | null;
    gameType: GameType | null;
}

const initialState: STTTGameSliceState = {
    boards: buildSuperGameBoard(),
    currentPlayer: PLAYER_X,
    selectedBoard: null,
    winner: null,
    gameType: null
}

export const STTTGameSlice = createSlice({
    name: 'STTTGame',
    initialState,
    reducers: {
        claimCell(state, action: PayloadAction<CellIdentifier>) {
            const { row, col } = action.payload;

            const { selectedBoard, currentPlayer, boards } = state;
            if (!selectedBoard) {
                throw new Error('No board selected');
            }

            const selectedCell = boards[selectedBoard.row][selectedBoard.col];
            if (selectedCell[row][col] !== PLAYER_EMPTY) {
                // Cell is already claimed
                return;
            }

            selectedCell[row][col] = currentPlayer;
        },
        cellClaimed(state, action: PayloadAction<CellIdentifier>) {
            const { row, col } = action.payload;

            const { selectedBoard, currentPlayer, boards } = state;
            if (!selectedBoard) {
                throw new Error('No board selected');
            }

            const selectedCell = boards[selectedBoard.row][selectedBoard.col];
            if (selectedCell[row][col] !== PLAYER_EMPTY) {
                // Cell is already claimed
                return;
            }

            selectedCell[row][col] = currentPlayer;
        },
        newGame(state) {
            state = initialState;
        },
        gameOver(state, action: PayloadAction<AllPlayers>) {
            state.winner = action.payload;
            state.selectedBoard = null;
        },
        selectBoard(state, action: PayloadAction<CellIdentifier | null>) {
            state.selectedBoard = action.payload;
        },
        setGameType(state, action: PayloadAction<GameType>) {
            state.gameType = action.payload;
        },
        switchPlayer(state) {
            state.currentPlayer = state.currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
        }
    }
});

export const STTTGameActions = STTTGameSlice.actions;

/** Derived Selectors */
const getCurrentPlayer = (state: RootState) => state.STTTGame.currentPlayer;
const getSelectedBoard = (state: RootState) => state.STTTGame.selectedBoard;
const getSuperGameBoard = (state: RootState) => state.STTTGame.boards;
const getWinner = (state: RootState) => state.STTTGame.winner;

/** Implied Selectors */
const getGameHasBoardSelected = (state: RootState) => state.STTTGame.selectedBoard !== null;
const getIsThisBoardSelected = (board: CellIdentifier) => (state: RootState) => {
    if (!isValidCell(board)) {
        throw new Error('Invalid cell selection');
    }
    return state.STTTGame.selectedBoard?.row === board.row && state.STTTGame.selectedBoard?.col === board.col;
}
const getSelectedBoardGame = (state: RootState) => {
    const selectedBoard = state.STTTGame.selectedBoard;
    if (!selectedBoard) {
        return null;
    }
    return state.STTTGame.boards[selectedBoard.row][selectedBoard.col];
}
const getSingleGameBoard = (board: CellIdentifier) => (state: RootState) => {
    if (!isValidCell(board)) {
        throw new Error('Invalid cell selection');
    }
    return state.STTTGame.boards[board.row][board.col];
}

export const STTTGameSelectors = {
    getCurrentPlayer,
    getGameHasBoardSelected,
    getIsThisBoardSelected,
    getSelectedBoard,
    getSelectedBoardGame,
    getSingleGameBoard,
    getSuperGameBoard,
    getWinner
};