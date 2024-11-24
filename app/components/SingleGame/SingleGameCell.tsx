'use client';

import { AllPlayers, CellIdentifier, PLAYER_EMPTY } from "@/app/constants";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

import styles from "./SingleGame.module.css";
import { STTTGameActions, STTTGameSelectors } from "../STTTGameSlice";

type SingleGameCellProps = {
    cell: CellIdentifier;
    parentBoard: CellIdentifier;
    value: AllPlayers;
};

const SingleGameCell = ({ cell, parentBoard, value }: SingleGameCellProps) => {
    const parentBoardIsSelected = useAppSelector(STTTGameSelectors.getIsThisBoardSelected(parentBoard));
    const dispatch = useAppDispatch();

    const claimCell = () => {
        dispatch(STTTGameActions.claimCell(cell));
    };

    return (
        <button
            className={styles.cell}
            onClick={claimCell}
            disabled={!parentBoardIsSelected || value !== PLAYER_EMPTY}
        >
            {value}
        </button>
    )
}

export default SingleGameCell;
