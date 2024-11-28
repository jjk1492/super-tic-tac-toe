import { Socket } from "socket.io";

export const TicTacToeTeams = {
    X: 'X',
    O: 'O',
} as const;
export type TicTacToeTeam = typeof TicTacToeTeams[keyof typeof TicTacToeTeams];
export type Player = {
    id: string;
    username: string;
    socket: Socket;
    team: TicTacToeTeam;
};

export type NewPlayer = Pick<Player, 'username'>;

export type Game = {
    id: string;
    players: Player[];
}

type ChatMessage = {
    sender: Pick<Player, 'id' | 'username'>;
    message: string;
};

const STTTG_MESSAGE_TYPES = {
    CREATE_GAME: 'create_game',
    JOIN_GAME: 'join_game',
    TURN_TAKE: 'turn_taken',
    SEND_MESSAGE: 'send_message',
}
export type StttgMessageType = typeof STTTG_MESSAGE_TYPES[keyof typeof STTTG_MESSAGE_TYPES];

export type CreateGame = {
    type: 'create_game';
    payload: {
        username: string;
    }
};

export type JoinGame = {
    type: 'join_game';
    payload: {
        gameId: string;
        username: string;
    }
};

export type CellIdentifier = {
    row: number;
    col: number;
}

export type TurnTaken = {
    type: 'turn_taken';
    payload: {
        gameId: string;
        playerId: string;
        cell: CellIdentifier;
        board: CellIdentifier;
    }
};

export type SendMessage = {
    type: 'send_message';
    payload: {
        message: string;
    }
};

export type AnyMessage = {
    type: string;
    payload: any;
};


export type WebSocketMessage = CreateGame | JoinGame | TurnTaken | SendMessage | AnyMessage;
