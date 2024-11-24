import { useAppSelector } from "@/lib/hooks"
import { STTTGameSelectors } from "./STTTGameSlice";

const GameWinner = () => {
    const winner = useAppSelector(STTTGameSelectors.getWinner);

    if (!winner) {
        return null;
    }

    return (
        <h2>{winner} wins!</h2>
    );
}

export default GameWinner;
