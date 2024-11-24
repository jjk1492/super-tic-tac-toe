import { AllPlayers, GamePlayers, PLAYER_EMPTY, SingleGameBoard, CellIdentifier } from "./constants";

export const buildSingleGameBoard = (): SingleGameBoard => (
    [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ]
);
export const buildSuperGameBoard = (): SingleGameBoard[][] => (
    [
        [buildSingleGameBoard(), buildSingleGameBoard(), buildSingleGameBoard()],
        [buildSingleGameBoard(), buildSingleGameBoard(), buildSingleGameBoard()],
        [buildSingleGameBoard(), buildSingleGameBoard(), buildSingleGameBoard()]
    ]
);
export const isValidCell = (cell: CellIdentifier) => cell.row >= 0 && cell.row <= 2 && cell.col >= 0 && cell.col <= 2;

/**
 * Helper function to check if a game is over.
 * Returns the winning player if the game is over, empty player if the game is tied, or null if the game is not over.
 */

export const checkForGameEnd = (board: SingleGameBoard): AllPlayers | null => {

        // Check rows and columns
        for (let i = 0; i < 3; i++) {
            const rowPlayer = board[i][0];
            if (rowPlayer !== PLAYER_EMPTY &&rowPlayer === board[i][1] && rowPlayer === board[i][2]) {
                return rowPlayer;
            }
            const colPlayer = board[0][i];
            if (colPlayer !== PLAYER_EMPTY && colPlayer === board[1][i] && colPlayer === board[2][i]) {
                return colPlayer;
            }
        }

        // Check top left to bottom right diagonal
        const topLeftPlayer = board[0][0];
        if (topLeftPlayer !== PLAYER_EMPTY && topLeftPlayer === board[1][1] && topLeftPlayer === board[2][2]) {
            return topLeftPlayer;
        }

        // Check top right to bottom left diagonal
        const topRightPlayer = board[0][2];
        if (topRightPlayer !== PLAYER_EMPTY && topRightPlayer === board[1][1] && topRightPlayer === board[2][0]) {
            return topRightPlayer;
        }

        if (board.flat().every((cell) => cell !== PLAYER_EMPTY)) {
            alert('It\'s a draw!');
            return PLAYER_EMPTY;
        }

        return null;
};


export const generateKey = (...args: string[]) => args.join('--');
