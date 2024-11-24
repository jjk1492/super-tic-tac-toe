'use client';

import { useAppSelector } from "@/lib/hooks";
import SuperGameBoard from "./SuperGameBoard";
import { STTTGameSelectors } from "./STTTGameSlice";
import GameWinner from "./GameWinner";

function SuperTicTacToe() {
    const currentPlayer = useAppSelector(STTTGameSelectors.getCurrentPlayer);
    return (
        <div>
            <h1>Super Tic Tac Toe</h1>
            <GameWinner />
            <p>{currentPlayer}, it's your turn!</p>
            <SuperGameBoard />
        </div>
    );
}

export default SuperTicTacToe;
