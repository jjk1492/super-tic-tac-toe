export const PLAYER_EMPTY = '' as const;
export const PLAYER_X = 'X' as const;
export const PLAYER_O = 'O' as const;
export const PLAYERS = [PLAYER_X, PLAYER_O, PLAYER_EMPTY];

export type AllPlayers = typeof PLAYERS[number];
export type GamePlayers = typeof PLAYER_X | typeof PLAYER_O;
export type SingleGameBoard = AllPlayers[][];
export type SolvedSuperGameBoard = (AllPlayers | null)[][];
export type CellIdentifier = { row: number, col: number };


export type Player = {
    id?: string;
    username?: string;
    team?: GamePlayers;
};

export type Message = {
    sender: Pick<Player, 'id' | 'username'>;
    message: string;
}

export const GameTypes = {
    "LOCAL": "LOCAL",
    "MULTIPLAYER": "MULTIPLAYER",
} as const;
export type GameType = typeof GameTypes[keyof typeof GameTypes];

export const MultiplayerLayouts = {
    "CREATE_GAME": "CREATE_GAME",
    "JOIN_GAME": "JOIN_GAME",
    "WAITING_ROOM": "WAITING_ROOM",
    "GAME": "GAME",
};
export type MultiplayerLayout = typeof MultiplayerLayouts[keyof typeof MultiplayerLayouts];
