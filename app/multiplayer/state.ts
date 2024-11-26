import { RootState } from "@/lib/store";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GamePlayers, MultiplayerLayouts, PLAYER_O, PLAYER_X } from "../constants";
import { STTTGameSelectors } from "../components/STTTGameSlice";

type Player = {
    id?: string;
    username?: string;
    team?: GamePlayers;
};

type MultiplayerState = {
    id: string | null;
    connectedPlayers: Player[];
    loggedInPlayer: Player;
};

const initialState: MultiplayerState = {
    id: null,
    connectedPlayers: [],
    loggedInPlayer: {},
};


export const multiplayerSlice = createSlice({
    name: 'multiplayer',
    initialState: initialState,
    reducers: {
        connectionEstablished: (state, action: PayloadAction<{ player: Player, gameId: string }>) => {
            state.loggedInPlayer!.id = action.payload.player.id;
            state.connectedPlayers.push(action.payload.player);
            state.id = action.payload.gameId;
        },
        createGame: (state, action: PayloadAction<string | undefined>) => {
            state.loggedInPlayer.team = PLAYER_X;
        },
        disconnect: (state, action: PayloadAction<Player>) => {
            state.connectedPlayers = state.connectedPlayers.filter(player => player.id !== action.payload.id);
        },
        joinGame: (state, action: PayloadAction<{ gameId: string, username: string }>) => { 
            state.loggedInPlayer.team = PLAYER_O;
        },
        playerConnected: (state, action: PayloadAction<Player>) => {
            state.connectedPlayers.push(action.payload);
        },
        setUsername: (state, action: PayloadAction<string>) => {
            state.loggedInPlayer = {
                username: action.payload
            };
        }
    }
});

export const MultiplayerActions = multiplayerSlice.actions;

const getConnectedPlayers = (state: RootState) => state.multiplayer.connectedPlayers;
const getLoggedInPlayer = (state: RootState) => state.multiplayer.loggedInPlayer;
const getGameId = (state: RootState) => state.multiplayer.id;
const getUsername = (state: RootState) => state.multiplayer.loggedInPlayer?.username;

/* Implement selectors */
const getIsInMultiplayerGame = (state: RootState) => {
    return Boolean(state.multiplayer.id);
}
const getIsCurrentPlayerConnected = (state: RootState) => {
    return Boolean(state.multiplayer.loggedInPlayer?.id && state.multiplayer.id);
}
const getAllPlayersAreConnected = (state: RootState) => {
    return state.multiplayer.connectedPlayers.length === 2;
}
const getMultiplayerLayout = createSelector(
    [getConnectedPlayers, getIsCurrentPlayerConnected],
    (connectedPlayers, isCurrentPlayerConnected) => {
        if (connectedPlayers.length === 2) {
            return MultiplayerLayouts.GAME;
        }
        if (isCurrentPlayerConnected) {
            return MultiplayerLayouts.WAITING_ROOM;
        }
        if (connectedPlayers.length === 1) {
            return MultiplayerLayouts.JOIN_GAME;
        }
        return MultiplayerLayouts.CREATE_GAME;
    }
);
const getCanTakeTurn = createSelector(
    [STTTGameSelectors.getCurrentPlayer, getLoggedInPlayer, getIsInMultiplayerGame],
    (currentPlayer, loggedInPlayer, isInMultiplayerGame) => !isInMultiplayerGame || currentPlayer === loggedInPlayer.team
);

export const MultiplayerSelectors = {
    getAllPlayersAreConnected,
    getCanTakeTurn,
    getConnectedPlayers,
    getGameId,
    getIsCurrentPlayerConnected,
    getIsInMultiplayerGame,
    getLoggedInPlayer,
    getMultiplayerLayout,
    getUsername
}