'use client';

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import Username from "../components/Username";
import { MultiplayerActions, MultiplayerSelectors } from "../state";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/app/components/Container";

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
        <Container>
            <h1>Join Game</h1>
            <div className="mb-3">
                <Username />
            </div>

            <div className="mb-3">
                <label>
                    <span>Enter the game ID</span>
                    <input className="form-control" type="text" placeholder="Game ID" onChange={handleChangeGameId} />
                </label>
            </div>
            <button className="btn btn-primary" onClick={handleJoinGame}>Join Game</button>
        </Container >
    );
}