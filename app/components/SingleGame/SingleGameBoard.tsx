'use client';

import { CellIdentifier } from "../../constants";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { STTTGameActions, STTTGameSelectors } from "../STTTGameSlice";
import { generateKey } from "../../helpers";
import classNames from "classnames";
import SingleGameCell from "./SingleGameCell";

import styles from "./SingleGame.module.css";

type GameBoardProps = {
    cell: CellIdentifier;
};

const GameBoard = ({ cell: boardIndex }: GameBoardProps) => {
    const dispatch = useAppDispatch();

    const board = useAppSelector(STTTGameSelectors.getSingleGameBoard(boardIndex));
    const boardIsSelected = useAppSelector(STTTGameSelectors.getIsThisBoardSelected(boardIndex));

    const takeTurn = (turn: CellIdentifier) => {
        dispatch(STTTGameActions.claimCell(turn));
    };

    const boardId = generateKey('SPGB', `row-${boardIndex.row}`, `col-${boardIndex.col}`);

    const classes = [styles.gameBoard];
    if (boardIsSelected) {
        classes.push(styles.selected);
    }

    return (
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
        </div>
    );
}

export default GameBoard;
