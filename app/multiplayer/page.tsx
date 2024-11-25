'use client';

import { useAppSelector } from "@/lib/hooks";
import { MultiplayerSelectors } from "./state";
import MultiplayerLayout from "./components/MultiplayerLayout";

export default function Page() {
    const username = useAppSelector(MultiplayerSelectors.getUsername);
    const connectedPlayers = useAppSelector(state => state.multiplayer.connectedPlayers);
    const gameId = useAppSelector(MultiplayerSelectors.getGameId);

    return (
        <div>
            <h1>Online Game</h1>
            <p>GameId: {gameId}</p>
            <p>Username: {username}</p>
            <p>Connected Players:</p>
            <ul>
                {connectedPlayers.map(player => (
                    <li key={player.id}>{player.username}</li>
                ))}
            </ul>
            <MultiplayerLayout />
        </div>
    )
}