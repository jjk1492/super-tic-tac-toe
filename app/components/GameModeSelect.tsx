import { useAppDispatch } from "@/lib/hooks";
import styles from "./SuperTicTacToe.module.css";

import Link from "next/link";

const GameModeSelect = () => {
    const dispatch = useAppDispatch();


    return (
        <div>
            <h2>Select game mode</h2>
            <div className={styles.gameChoices}>
                <Link href={'/local'}>Local play</Link>
                <Link href={'/multiplayer'}>Multiplayer</Link>
                <Link href={'/multiplayer/join'}>Join a game</Link>
                {/* <Link href={'/ai'}>Play against AI</Link> */}
            </div>
        </div>
    )
};

export default GameModeSelect;
