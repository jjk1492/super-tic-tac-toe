import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import styles from "./GameBoard.module.css";
import { STTTGameSelectors, STTTGameActions } from "./STTTGameSlice";
import { CellIdentifier } from "../constants";

type SelectGameButtonProps = {
    cell: CellIdentifier;
};

const SelectGameButton = ({ cell }: SelectGameButtonProps) => {
    const dispatch = useAppDispatch();
    const someBoardIsSelected = useAppSelector(STTTGameSelectors.getGameHasBoardSelected);


    const takeTurn = () => {
        dispatch(STTTGameActions.selectBoard(cell));
    }

    if (someBoardIsSelected) {
        return null;
    }
    return (
        <button
            onClick={takeTurn}
            className={styles.selectGameButton}
            aria-label={`Select game ${cell.row} ${cell.col}`}
        />
    );
}

export default SelectGameButton;