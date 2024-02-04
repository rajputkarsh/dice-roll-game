/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  createSlice,
  createSelector,
  ActionReducerMapBuilder,
} from '@reduxjs/toolkit';
import { AppState } from '../store';

export interface ITimerSlice {
  isRunning: boolean;
  time: number;
  title: string;
}

const initialState: ITimerSlice = {
  isRunning: false,
  time: 0,
  title: '',
};

export const timerSlice = createSlice({
  name: 'timer',
  initialState: initialState,
  reducers: {
    start: (
      state,
      action: { payload: { time: number; title: string }; type: string }
    ) => {
      state.isRunning = true;
      state.title = action.payload.title;
      state.time = action.payload.time;
    },
    pause: (state) => {
      state.isRunning = false;
    },
    reset: (state) => {
      state.isRunning = false;
      state.time = 0;
      state.title = '';
    },
    updateTitle: (
      state,
      action: { payload: { title: string }; type: string }
    ) => {
      state.title = action.payload.title;
    },
    tick: (state, action: { payload: { time: number }; type: string }) => {
      if (state.isRunning) {
        if (state.time > 0) {
          state.time -= action.payload.time;
        }
      }
    },
  },
  extraReducers: (_builders: ActionReducerMapBuilder<ITimerSlice>) => {},
});

// Function to select timer slice root state
const selectTimerRootState = (state: AppState): ITimerSlice => state.timer;

export const getTimeLeft = createSelector<
  [(state: AppState) => ITimerSlice],
  number
>([selectTimerRootState], (timerState) => timerState.time);

export const isTimerRunning = createSelector<
  [(state: AppState) => ITimerSlice],
  boolean
>([selectTimerRootState], (timerState) => timerState.isRunning);

export const getTimerTitle = createSelector<
  [(state: AppState) => ITimerSlice],
  string
>([selectTimerRootState], (timerState) => timerState.title);

export const { start, pause, reset, tick, updateTitle } = timerSlice.actions;
export default timerSlice.reducer;
