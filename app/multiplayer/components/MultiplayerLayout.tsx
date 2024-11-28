import SuperGameBoard from "@/app/components/SuperGame/SuperGameBoard";
import { MultiplayerLayouts } from "@/app/constants";
import { useAppSelector } from "@/lib/hooks";
import { MultiplayerSelectors } from "../state";
import CreateGame from "./CreateGame";
import WaitingRoom from "./WaitingRoom";
import PlayerChat from "./PlayerChat/PlayerChat";

function MultiplayerLayout() {
    const multiplayerLayout = useAppSelector(MultiplayerSelectors.getMultiplayerLayout);

    if (multiplayerLayout === MultiplayerLayouts.GAME) {
        return (
            <>
                <div className="col-12 col-lg-6">
                    <SuperGameBoard />
                </div>
                <div className="col-12 col-lg-6">
                    <PlayerChat />
                </div>
            </>
        );
    }
    if (multiplayerLayout === MultiplayerLayouts.WAITING_ROOM) {
        return <WaitingRoom />;
    }
    return (
        <CreateGame />
    );
}

export default MultiplayerLayout;
