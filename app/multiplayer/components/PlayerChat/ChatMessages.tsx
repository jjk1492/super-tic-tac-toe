import { Message } from "@/app/constants";
import { useAppSelector } from "@/lib/hooks";
import classNames from "classnames";
import { MultiplayerSelectors } from "../../state";
import styles from "./PlayerChat.module.css";

function ChatMessages() {
  const chatMessages = useAppSelector(MultiplayerSelectors.getMessages);
  const currentPlayer = useAppSelector(MultiplayerSelectors.getLoggedInPlayer);

  const getContainerClasses = (message: Message) => {
    const classnames = [styles.messageContainer];
    if (message.sender.id === currentPlayer.id) {
      classnames.push(styles.sender);
    } else {
      classnames.push(styles.receiver);
    }
    return classnames;
  }

  return (
    <div className={styles.chatMessages}>
      {chatMessages.map((message, index) => (
        <div className={classNames(getContainerClasses(message))}>
          <div key={index} className={styles.message}>
            <span className={styles.name}>{message.sender.username}</span>
            <span className={styles.messageContent}>{message.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChatMessages;
