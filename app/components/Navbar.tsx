import Link from "next/link";
import styles from "./Navbar.module.css";

function Navbar() {
    return (
        <nav className={styles.navbar}>
            <ul>
                <li><Link href={'/local'} className="stretched-link">Local play</Link></li>
                <li><Link href={'/multiplayer'} className="stretched-link">Multiplayer</Link></li>
                <li><Link href={'/multiplayer/join'} className="stretched-link">Join a game</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;
