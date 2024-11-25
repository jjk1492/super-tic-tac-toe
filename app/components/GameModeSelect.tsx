import { useAppDispatch } from "@/lib/hooks";

import Link from "next/link";

const GameModeSelect = () => {
    const dispatch = useAppDispatch();


    return (
        <div>
            <h2>Select game mode</h2>
            <div>
                <Link href={'/local'}>Local play</Link>
                <Link href={'/multiplayer'}>Multiplayer</Link>
            </div>
        </div>
    )
};

export default GameModeSelect;
