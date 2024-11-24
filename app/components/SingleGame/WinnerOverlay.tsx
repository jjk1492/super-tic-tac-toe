import styles from "./SingleGame.module.css";
import classNames from "classnames";

type WinnerOverlayProps = {
    winner: string | null;
};

const WinnerOverlay = ({ winner }: WinnerOverlayProps) => {
    if (!winner) {
        return null;
    }

    const winnerClass = styles[`winner${winner.toUpperCase()}`];

    return (
        <div className={classNames(styles.winnerOverlay, winnerClass)}>
            <span className={styles.winnerOverlayContent}>
               {winner}
            </span>
        </div>
    );
};

export default WinnerOverlay;
