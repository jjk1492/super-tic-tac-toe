export const PLAYER_EMPTY = '' as const;
export const PLAYER_X = 'X' as const;
export const PLAYER_O = 'O' as const;
export const PLAYERS = [PLAYER_X, PLAYER_O, PLAYER_EMPTY];

export type AllPlayers = typeof PLAYERS[number];
export type GamePlayers = typeof PLAYER_X | typeof PLAYER_O;
export type SingleGameBoard = AllPlayers[][];
export type CellIdentifier = { row: number, col: number };
