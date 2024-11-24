'use client';

import { useAppSelector } from "@/lib/hooks";
import classNames from "classnames";
import { CellIdentifier } from "../../constants";
import { checkForGameEnd, generateKey, getGameWinnerName } from "../../helpers";
import { STTTGameSelectors } from "../STTTGameSlice";
import SingleGameCell from "./SingleGameCell";

import styles from "./SingleGame.module.css";
import WinnerOverlay from "./WinnerOverlay";
import SelectGameButton from "../SelectGameButton";
import { useMemo } from "react";

type GameBoardProps = {
    cell: CellIdentifier;
};

const GameBoard = ({ cell: boardIndex }: GameBoardProps) => {
    const board = useAppSelector(STTTGameSelectors.getSingleGameBoard(boardIndex));
    const boardIsSelected = useAppSelector(STTTGameSelectors.getIsThisBoardSelected(boardIndex));

    const boardId = generateKey('SPGB', `row-${boardIndex.row}`, `col-${boardIndex.col}`);


    const winner = useMemo(() => {
        const gameResult = checkForGameEnd(board);
        return getGameWinnerName(gameResult);
    }, [board]);


    const classes = [styles.gameBoard];
    if (boardIsSelected) {
        classes.push(styles.selected);
    }

    return (
        <>
            <div className={classNames(classes)}>
                {board.map((row, rowIndex) => (
                    <div className={styles.row} key={generateKey(boardId, 'SIGB', `row-${rowIndex}`)}>
                        {row.map((cell, colIndex) => (
                            <SingleGameCell
                                key={generateKey(boardId, 'SIGB', `row-${rowIndex}`, `col-${colIndex}`)}
                                cell={{ row: rowIndex, col: colIndex }}
                                parentBoard={boardIndex}
                                value={cell}
                            />
                        ))}
                    </div>
                ))}
                <WinnerOverlay winner={winner} />
            </div>
            <SelectGameButton cell={boardIndex} winner={winner} />
        </>
    );
}

export default GameBoard;
