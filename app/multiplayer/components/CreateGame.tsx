import { useAppDispatch } from "@/lib/hooks";
import { MultiplayerActions } from "../state";
import Username from "./Username";

function CreateGame() {
    const dispatch = useAppDispatch();
    const handleCreateGame = () => {
        dispatch((MultiplayerActions.createGame()));
    };
    return (
        <div>
            <h2>Create a game</h2>
            <Username />

            <button onClick={handleCreateGame}>Create game</button>
        </div>
    );
}

export default CreateGame;