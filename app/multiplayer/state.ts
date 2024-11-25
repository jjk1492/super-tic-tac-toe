import { RootState } from "@/lib/store";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MultiplayerLayout, MultiplayerLayouts } from "../constants";
import { createSelectorHook } from "react-redux";
import { v4 as uuidv4 } from 'uuid';

type Player = {
    id?: string;
    username: string;
};

type MultiplayerState = {
    id: string | null;
    connectedPlayers: Player[];
    currentPlayer: Player | null;
};

const initialState: MultiplayerState = {
    id: null,
    connectedPlayers: [],
    currentPlayer: null
};


export const multiplayerSlice = createSlice({
    name: 'multiplayer',
    initialState: initialState,
    reducers: {
        connectionEstablished: (state, action: PayloadAction<{ player: Player, gameId: string }>) => {
            if(!state.currentPlayer) {
                throw new Error('Current player not set');
            }

            state.currentPlayer.id = action.payload.player.id;
            state.connectedPlayers.push(action.payload.player);
            state.id = action.payload.gameId;
        },
        createGame: (state, action: PayloadAction<string | undefined>) => {},
        disconnect: (state, action: PayloadAction<Player>) => {
            state.connectedPlayers = state.connectedPlayers.filter(player => player.id !== action.payload.id);
        },
        joinGame: (state, action: PayloadAction<{gameId: string, username: string}>) => {},
        playerConnected: (state, action: PayloadAction<Player>) => {
            state.connectedPlayers.push(action.payload);
        },
        setUsername: (state, action: PayloadAction<string>) => {
            if(!state.currentPlayer) {
                state.currentPlayer = {
                    username: action.payload
                };
                  return;
            }
        }
    }
});

export const MultiplayerActions = multiplayerSlice.actions;

const getConnectedPlayers = (state: RootState) => state.multiplayer.connectedPlayers;
const getCurrentPlayer = (state: RootState) => state.multiplayer.currentPlayer;
const getGameId = (state: RootState) => state.multiplayer.id;
const getUsername = (state: RootState) => state.multiplayer.currentPlayer?.username;

/* Implement selectors */
const getIsCurrentPlayerConnected = (state: RootState) => {
    return Boolean(state.multiplayer.currentPlayer?.id && state.multiplayer.id);
}
const getAllPlayersAreConnected = (state: RootState) => {
    return state.multiplayer.connectedPlayers.length === 2;
}
const getMultiplayerLayout = (state: RootState) => {
    const connectedPlayers = getConnectedPlayers(state);
    const isCurrentPlayerConnected = getIsCurrentPlayerConnected(state);

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

export const MultiplayerSelectors = {
    getAllPlayersAreConnected,
    getConnectedPlayers,
    getCurrentPlayer,
    getGameId,
    getIsCurrentPlayerConnected,
    getMultiplayerLayout,
    getUsername
}