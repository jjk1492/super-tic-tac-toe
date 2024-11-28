import { RootState } from "@/lib/store";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message, MultiplayerLayouts, Player, PLAYER_O, PLAYER_X } from "../constants";
import { STTTGameSelectors } from "../components/STTTGameSlice";
import { playerDisconnected } from "@/server/gameService";


type MultiplayerState = {
    id: string | null;
    connectedPlayers: Player[];
    loggedInPlayer: Player;
    messages: Message[];
};

const initialState: MultiplayerState = {
    id: null,
    connectedPlayers: [],
    loggedInPlayer: {},
    messages: []
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
        playerDisconnected:  (state, action: PayloadAction<Player>) => {
            state.connectedPlayers = state.connectedPlayers.filter(player => player.id !== action.payload.id);
        },
        setUsername: (state, action: PayloadAction<string>) => {
            state.loggedInPlayer = {
                username: action.payload
            };
        },
        sendMessage: (state, action: PayloadAction<string>) => {
            state.messages.push({
                sender: {
                    id: state.loggedInPlayer.id!,
                    username: state.loggedInPlayer.username!
                },
                message: action.payload
            });
        },
        messageReceived: (state, action: PayloadAction<Message>) => {
            state.messages.push(action.payload);
        }
    }
});

export const MultiplayerActions = multiplayerSlice.actions;

const getConnectedPlayers = (state: RootState) => state.multiplayer.connectedPlayers;
const getGameId = (state: RootState) => state.multiplayer.id;
const getLoggedInPlayer = (state: RootState) => state.multiplayer.loggedInPlayer;
const getMessages = (state: RootState) => state.multiplayer.messages;
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
    getMessages,
    getMultiplayerLayout,
    getUsername
}