'use client';

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import Username from "../components/Username";
import { MultiplayerActions, MultiplayerSelectors } from "../state";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
    const dispatch = useAppDispatch();
    const navigate = useRouter();
    const username = useAppSelector(MultiplayerSelectors.getUsername);
    const [gameId, setGameId] = useState('');
    const handleChangeGameId = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGameId(event.target.value);
    }
    const playerIsConnected = useAppSelector(MultiplayerSelectors.getIsCurrentPlayerConnected);
    useEffect(() => {
        if (playerIsConnected) {
            // Redirect to the game page
            navigate.push('/multiplayer');
        }
    }, [playerIsConnected]);

    const handleJoinGame = () => {
        if (!username) {
            return;
        }
        dispatch((MultiplayerActions.joinGame({
            gameId,
            username,
        })));
    };

    return (
        <div>
            <h1>Join Game</h1>
            <Username />
            <input type="text" placeholder="Game ID" onChange={handleChangeGameId}/>
            <button onClick={handleJoinGame}>Join Game</button>
        </div>
    );
}