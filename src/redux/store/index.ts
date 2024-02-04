import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import gameReducer, * as gameSlice from '../slices/game.slice';
import timerReducer, * as timerSlice from '../slices/timer.slice';

const persistConfig = {
  key: 'root',
  version: 2,
  storage: storage,
  whitelist: ['game', 'timer'],
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    game: gameReducer,
    timer: timerReducer,
  })
);

export const Slices = {
  gameSlice,
  timerSlice,
};

const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredActionPaths: [
          'meta.arg',
          'payload.timestamp',
          'payload.headers',
        ],
      },
    }),
});

export type AppStore = typeof store.dispatch;
export type AppState = ReturnType<typeof persistedReducer>;

export default store;
