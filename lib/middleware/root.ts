import { addListener, createListenerMiddleware, ListenerEffectAPI } from "@reduxjs/toolkit"
import { RootState, AppDispatch } from "../store"

export const listenerMiddleware = createListenerMiddleware()

export const startAppListening = listenerMiddleware.startListening.withTypes<
    RootState,
    AppDispatch
>()

export const addAppListener = addListener.withTypes<RootState, AppDispatch>()

export const selectCurrentState = (listenerApi: ListenerEffectAPI<RootState, AppDispatch>) => {
    const state = listenerApi.getState();

    function selector<T extends unknown>(selector: (state: RootState) => T): T {
        return selector(state);
    }
    return selector;
}

export const selectOriginalState = (listenerApi: ListenerEffectAPI<RootState, AppDispatch>) => {
    const state = listenerApi.getOriginalState();

    function selector<T extends unknown>(selector: (state: RootState) => T): T {
        return selector(state);
    }
    return selector;
}
