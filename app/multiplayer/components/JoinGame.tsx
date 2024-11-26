import { useAppSelector } from "@/lib/hooks";
import Username from "./Username";
import { MultiplayerSelectors } from "../state";

function JoinGame() {
    const username = useAppSelector(MultiplayerSelectors.getUsername);

    return (
        <div>
            <h1>Join Game</h1>
            <Username />
            <link href="/multiplayer" aria-disabled={Boolean(username)}>Join Game</link>
        </div>
    );
}

export default JoinGame;
