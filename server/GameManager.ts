import { Game, Player } from "./types";
import { v4 as uuidv4 } from 'uuid';

type GamesObject = Record<string, Game>;

class GameManager {
    games: GamesObject;

    constructor() {
        this.games = {}
    }

    createGame(player: Player) {
        const game = {
            id: uuidv4(),
            players: [player]
        }
        this.games[game.id] = game;

        return game;
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

    getGame(id: string) {
        return this.games[id];
    }

    /**
     * Ends a game by disconnecting all players and removing the game from the list
     */
    endGame(id: string) {
        const game = this.games[id];
        game.players.forEach(player => {
            player.socket.disconnect();
        });
        delete this.games[id];
    }
}

const gameManager = new GameManager();
export default gameManager;
