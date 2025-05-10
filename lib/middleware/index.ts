import startMultiplayerListeners from "./super-tic-tac-toe/STTGMultiplaterListeners"
import startGameListeners from "./super-tic-tac-toe/STTTGameMiddleware"

/**
 * Instantiate middleware listeners before exporting the middleware
 * This is to ensure that the listeners are created before the middleware is used
 */
startGameListeners();
startMultiplayerListeners();

/**
 * All app middleware is registered in this file and accessed via this export
 */
export { listenerMiddleware} from "./root"