import { useAppDispatch } from "@/lib/hooks";
import { MultiplayerActions } from "../state";

function Username() {
    const dispatch = useAppDispatch();
    const validateUsername = (username: string) => {
        return /^[a-zA-Z0-9]+$/.test(username);
    };

    const handleUsernameBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        const username = event.target.value;
        event.target.setCustomValidity("");
        if (!validateUsername(username)) {
            event.target.setCustomValidity("Username must contain only letters and numbers");
            return;
        }
        dispatch(MultiplayerActions.setUsername(username));
    }

    return (
        <label>
            <span>Create a username</span>
            <input type="text" placeholder="Letters and numbers allowed" onBlur={handleUsernameBlur} />
        </label>
    )
}

export default Username;
