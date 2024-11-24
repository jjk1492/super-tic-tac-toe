'use client';

import { useAppSelector } from "@/lib/hooks";
import { STTTGameSelectors } from "./STTTGameSlice";
import GameWinner from "./SuperGame/GameWinner";
import SuperGameBoard from "./SuperGame/SuperGameBoard";
import styles from "./SuperTicTacToe.module.css";

function SuperTicTacToe() {
    const currentPlayer = useAppSelector(STTTGameSelectors.getCurrentPlayer);
    return (
        <div className={styles.superGameContainer}>
            <h1>Super Tic Tac Toe</h1>
            <GameWinner />
            <p>{currentPlayer}, it's your turn!</p>
            <SuperGameBoard />
        </div>
    );
}

export default SuperTicTacToe;
