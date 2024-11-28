import { useAppDispatch } from "@/lib/hooks";
import { useState } from "react";
import { MultiplayerActions } from "../../state";

function SendMessage() {
    const dispatch = useAppDispatch();
    const [message, setMessage] = useState('');

    const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
    }

    const handleSendMessage = () => {
        if (!message) {
            return;
        }
        dispatch(MultiplayerActions.sendMessage(message));
        setMessage('');
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    }

    return (
        <div className="input-group">
            <input
                className="form-control"
                type="text"
                onKeyDown={handleKeyDown}
                onChange={handleMessageChange}
                value={message}
                placeholder="Enter your message"
            />
            <button className="btn btn-primary" onClick={handleSendMessage}>Send</button>
        </div>
    );
}

export default SendMessage;
