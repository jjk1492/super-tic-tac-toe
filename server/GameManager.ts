import { Game, Player } from "./types";
import { v4 as uuidv4 } from 'uuid';

type GamesObject = Record<string, Game>;

class GameManager {
    games: GamesObject;

    constructor() {
        this.games = {}
    }

    addPlayerToGame(gameId: string, player: Player) {
        if (!this.games[gameId]) {
            throw new Error('Game not found');
        }
        if (this.games[gameId].players.length > 1) {
            throw new Error('Game is full');
        }
        this.games[gameId].players.push(player);
    }

    createGame(player: Player) {
        const game = {
            id: uuidv4(),
            players: [player]
        }
        this.games[game.id] = game;

        return game;
    }

    /**
     * Ends a game by disconnecting all players and removing the game from the list
     */
    endGame(id: string) {
        const game = this.games[id];
        if (!game) {
            throw new Error('Game not found');
        }
        // destroy sockets BEFORE deleting the game
        // otherwise we lose the reference to the sockets and can't disconnect them
        game.players.forEach(player => {
            player.socket.disconnect();
        });

        delete this.games[id];
    }

    getGame(id: string) {
        return this.games[id];
    }

    getPlayer(id: string, gameId: string) {
        const game = this.games[gameId];
        return game?.players.find(player => player.id === id);
    }

    getPlayerBySocketId(socketId: string) {
        const game = Object.values(this.games).find(game => game.players.some(player => player.socket.id === socketId));
        if (!game) {
            return null;
        }
        return game.players.find(player => player.socket.id === socketId);
    }

    removePlayerFromGame(playerId: string, gameId: string) {
        const game = this.games[gameId];
        game.players = game.players.filter(player => player.id !== playerId);
        if (game.players.length === 0) {
            this.endGame(gameId);
        }
    }
}

const gameManager = new GameManager();
export default gameManager;
