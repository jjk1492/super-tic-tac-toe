'use client';

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { CellIdentifier } from "../../constants";
import { STTTGameActions, STTTGameSelectors } from "../STTTGameSlice";
import styles from "./SingleGame.module.css";

type SelectGameButtonProps = {
    cell: CellIdentifier;
    winner: string | null;
};

const SelectGameButton = ({ cell, winner }: SelectGameButtonProps) => {
    const dispatch = useAppDispatch();
    const someBoardIsSelected = useAppSelector(STTTGameSelectors.getGameHasBoardSelected);
    const superGameWinner = useAppSelector(STTTGameSelectors.getWinner);


    const takeTurn = () => {
        dispatch(STTTGameActions.selectBoard(cell));
    }

    if (someBoardIsSelected) {
        return null;
    }
    return (
        <button
            onClick={takeTurn}
            className={styles.selectGameButton}
            aria-label={`Select game ${cell.row} ${cell.col}`}
            disabled={Boolean(winner) || typeof superGameWinner === 'string'}
        />
    );
}

export default SelectGameButton;