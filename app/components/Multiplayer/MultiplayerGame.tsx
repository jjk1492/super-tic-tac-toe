import GameWinner from "../SuperGame/GameWinner";
import SuperGameBoard from "../SuperGame/SuperGameBoard";

/**
 * Wrapper of the SuperGameBoard component that adds multiplayer functionality.
 * Multiplayer games are integrated with websockets, provided by socketIO, to allow for real-time gameplay.
 * This wrapper component handles the websocket connection and message passing.
 */
const MultiplayerGame = () => {
    return (
        <div>
            <h1>Super Tic Tac Toe</h1>
            <GameWinner />
            <p>it's your turn!</p>
            <SuperGameBoard />
        </div>
    );
};

export default MultiplayerGame;
