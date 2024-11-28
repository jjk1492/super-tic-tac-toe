import ChatMessages from "./ChatMessages";
import SendMessage from "./SendMessage";
import styles from "./PlayerChat.module.css";

function PlayerChat() {
    return (
        <div className={styles.playerChat}>
            <ChatMessages />
            <SendMessage />
        </div>
    );
}

export default PlayerChat;
