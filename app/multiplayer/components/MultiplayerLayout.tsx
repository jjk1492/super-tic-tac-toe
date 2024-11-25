import SuperGameBoard from "@/app/components/SuperGame/SuperGameBoard";
import { MultiplayerLayouts } from "@/app/constants";
import { useAppSelector } from "@/lib/hooks";
import { MultiplayerSelectors } from "../state";
import CreateGame from "./CreateGame";
import JoinGame from "./JoinGame";
import WaitingRoom from "./WaitingRoom";

function MultiplayerLayout() {
    const multiplayerLayout = useAppSelector(MultiplayerSelectors.getMultiplayerLayout);

    if(multiplayerLayout === MultiplayerLayouts.GAME) {
        return <SuperGameBoard />;
    }
    if(multiplayerLayout === MultiplayerLayouts.WAITING_ROOM) {
        return <WaitingRoom />;
    }
    if(multiplayerLayout === MultiplayerLayouts.JOIN_GAME) {
        return <JoinGame />;
    }

    return (
        <CreateGame />
    );
}

export default MultiplayerLayout;
