/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  createSlice,
  createSelector,
  ActionReducerMapBuilder,
} from '@reduxjs/toolkit';
import { AppState } from '../store';

export type IDiceNumber = '1' | '2' | '3' | '4' | '5' | '6';

export interface IBet {
  diceNumber?: '1' | '2' | '3' | '4' | '5' | '6';
  amountPlaced: number;
  won: boolean;
}

export type ICurrentBet = { [key in IDiceNumber]: IBet };

export interface IGameHistory {
  roundId: string;
  winAmount: number;
  bets: Array<IBet>;
}

export interface IGameSlice {
  userName: string;
  balance: number;
  currentBet: ICurrentBet;
  history: Array<IGameHistory>;
}

const initialState: IGameSlice = {
  userName: 'User',
  balance: 100,
  currentBet: {
    '1': {
      amountPlaced: 0,
      won: false,
    },
    '2': {
      amountPlaced: 0,
      won: false,
    },
    '3': {
      amountPlaced: 0,
      won: false,
    },
    '4': {
      amountPlaced: 0,
      won: false,
    },
    '5': {
      amountPlaced: 0,
      won: false,
    },
    '6': {
      amountPlaced: 0,
      won: false,
    },
  },
  history: [],
};

export const gameSlice = createSlice({
  name: 'game',
  initialState: initialState,
  reducers: {
    resetProgess: (state) => {
      state.balance = initialState.balance;
      state.currentBet = JSON.parse(JSON.stringify(initialState.currentBet));
      state.history = [];
    },
    resetCurrentBet: (state) => {
      state.currentBet = JSON.parse(JSON.stringify(initialState.currentBet));
    },
    updateUserName: (state, action: { payload: string; type: string }) => {
      state.userName = action.payload;
    },
    updateBalance: (state, action: { payload: number; type: string }) => {
      state.balance = action.payload;
    },
    placeAmountOnDice: (
      state,
      action: {
        payload: { diceNumber: IDiceNumber; amount: number };
        type: string;
      }
    ) => {
      state['currentBet'][action.payload.diceNumber]['amountPlaced'] =
        action.payload.amount;
    },
    saveGame: (state, action: { payload: IGameHistory; type: string }) => {
      const history: Array<IGameHistory> = JSON.parse(
        JSON.stringify(state.history)
      );
      history.push({
        roundId: action.payload.roundId,
        winAmount: action.payload.winAmount,
        bets: action.payload.bets,
      });
      state.history = [...history];
    },
  },
  extraReducers: (_builders: ActionReducerMapBuilder<IGameSlice>) => {},
});

// Function to select game slice root state
const selectGameRootState = (state: AppState): IGameSlice => state.game;

export const getUserName = createSelector<
  [(state: AppState) => IGameSlice],
  string
>([selectGameRootState], (gameState) => gameState.userName);

export const getBalance = createSelector<
  [(state: AppState) => IGameSlice],
  number
>([selectGameRootState], (gameState) => gameState.balance);

export const getCurrentBet = createSelector<
  [(state: AppState) => IGameSlice],
  ICurrentBet
>([selectGameRootState], (gameState) => gameState.currentBet);

export const getGameHistory = createSelector<
  [(state: AppState) => IGameSlice],
  Array<IGameHistory>
>([selectGameRootState], (gameState) => gameState.history);

export const {
  resetCurrentBet,
  updateUserName,
  updateBalance,
  placeAmountOnDice,
  saveGame,
  resetProgess,
} = gameSlice.actions;

export default gameSlice.reducer;
