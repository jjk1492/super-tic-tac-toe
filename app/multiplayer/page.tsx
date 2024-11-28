'use client';

import { useAppSelector } from "@/lib/hooks";
import { MultiplayerSelectors } from "./state";
import MultiplayerLayout from "./components/MultiplayerLayout";
import Container from "../components/Container";
import { toast } from "react-toastify";

export default function Page() {
    const username = useAppSelector(MultiplayerSelectors.getUsername);
    const connectedPlayers = useAppSelector(MultiplayerSelectors.getConnectedPlayers);
    const gameId = useAppSelector(MultiplayerSelectors.getGameId);

    const copyGameId = () => {
        if (!gameId) return;
        navigator.clipboard.writeText(gameId);
        toast.success('GameId copied to clipboard');
    }

    return (
        <Container>
            <div className="row">
                <div className="col-12">
                    <h1>Online Game</h1>
                    <p>GameId: {gameId} <button onClick={copyGameId}>Copy</button></p>
                    <p>Username: {username}</p>
                    <p>Connected Players:</p>
                    <ul>
                        {connectedPlayers.map(player => (
                            <li key={player.id}>{player.username}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="row">
                <MultiplayerLayout />
            </div>
        </Container>
    )
}