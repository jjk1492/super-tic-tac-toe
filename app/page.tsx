'use client';

import GameModeSelect from "./components/GameModeSelect";

function HomePage() {
    
    return (
        <div>
            <h1>Super Tic Tac Toe</h1>
            <p>Welcome to super Tic-Tac-Toe, the game of Tic-Tac-Toe of Tic-Tac-Toes!</p>
            <p>Select a game type to get started</p>
            <GameModeSelect />
        </div>
    )
}

export default HomePage;