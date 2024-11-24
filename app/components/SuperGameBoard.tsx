
'use client';

import SingleGameBoard from "./SingleGame/SingleGameBoard";
import { useAppSelector } from "@/lib/hooks";
import { STTTGameSelectors } from "./STTTGameSlice";
import { generateKey } from "../helpers";

import styles from "./GameBoard.module.css";
import SelectGameButton from "./SelectGameButton";

/**
 * Control board for a game of super tic-tac-toe.
 * 
 * Super tic-tac-toe is a game where each cell of the board is a unique game of tic-tac-toe.
 * Players claim cells on the board by winning the game of tic-tac-toe in that cell.
 * 
 * The game is won by winning the game of tic-tac-toe in a row, column, or diagonal of the board.
 * 
 * Turn rules:
 * The first player can play in any cell.
 * The next player must play in the cell corresponding to the cell of the previous player's move.
 * If the corresponding cell is a finished, the player can play in any cell.
 */
const SuperGameBoard = () => {
    const board = useAppSelector(STTTGameSelectors.getSuperGameBoard);

    return (
        <div className={styles.superBoard}>
            {board.map((row, rowIndex) => (
                <div className={styles.row} key={generateKey('SPGB', `row-${rowIndex}`)}>
                    {row.map((cell, colIndex) => (
                        <div
                            key={generateKey('SPGB', `row-${rowIndex}`, `col-${colIndex}`)}
                            className={styles.cell}
                        >
                            <SingleGameBoard cell={{ row: rowIndex, col: colIndex }} />
                            <SelectGameButton cell={{ row: rowIndex, col: colIndex }} />
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default SuperGameBoard;
