/* eslint-disable @typescript-eslint/no-unused-vars */
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../redux/store';
import {
  ICurrentBet,
  IDiceNumber,
  getBalance,
  getCurrentBet,
  resetCurrentBet,
  saveGame,
  updateBalance,
} from '../../redux/slices/game.slice';

import css from './index.module.scss';
import {
  getTimeLeft,
  getTimerTitle,
  isTimerRunning,
  pause,
  reset,
  start,
  updateTitle,
} from '../../redux/slices/timer.slice';
import { useEffect, useState } from 'react';
import { BETTING_TIME, BETTING_TIMER_TITLE } from '../PlaceBets';

export const RESULT_TIME = 2;
export const RESULT_TIMER_TITLE = 'RESULT';

function Result() {
  const dispatch = useDispatch();

  const [result, setResult] = useState<IDiceNumber | -1>(-1);
  const [overallWin, setOverallWin] = useState<number>(0);

  const balance = useSelector<AppState, number>(getBalance);
  const currentBet = useSelector<AppState, ICurrentBet>(getCurrentBet);

  const timerRunning = useSelector<AppState, boolean>(isTimerRunning);
  const timerTitle = useSelector<AppState, string>(getTimerTitle);
  const timeLeft = useSelector<AppState, number>(getTimeLeft);

  const getResult = (): IDiceNumber => {
    return (Math.floor(Math.random() * 6) + 1) as unknown as IDiceNumber;
  };

  const getTotalBet = (): number => {
    return Object.entries(currentBet).reduce((totalAmount, [_, bet]) => {
      return totalAmount + Number(bet.amountPlaced);
    }, 0);
  };

  useEffect(() => {
    if (timerRunning && timeLeft === 0) {
      if (timerTitle === BETTING_TIMER_TITLE) {
        dispatch(start({ time: RESULT_TIME, title: RESULT_TIMER_TITLE }));
      } else if (timerTitle === RESULT_TIMER_TITLE) {
        const dice = getResult();
        const totalAmountWon = (currentBet[dice].amountPlaced || 0) * 2;
        const bettingAmount = getTotalBet();

        const newBalance = balance - bettingAmount + totalAmountWon;

        console.log(
          `${result} saving game with data - `,
          JSON.stringify(
            {
              roundId: crypto.randomUUID(),
              winAmount: overallWin,
              bets: Object.entries(currentBet).map(([key, bet]) => ({
                diceNumber: key as IDiceNumber,
                amountPlaced: bet.amountPlaced,
                won: key == result,
              })),
            },
            null,
            2
          )
        );

        dispatch(
          saveGame({
            roundId: crypto.randomUUID(),
            winAmount: overallWin,
            bets: Object.entries(currentBet).map(([key, bet]) => ({
              diceNumber: key as IDiceNumber,
              amountPlaced: bet.amountPlaced,
              won: key == result,
            })),
          })
        );
        dispatch(pause());
        dispatch(updateTitle({ title: '' }));
        dispatch(updateBalance(newBalance));
        setOverallWin(totalAmountWon);
        setResult(dice);
      }
    }
  }, [timeLeft]);

  if (timerTitle === BETTING_TIMER_TITLE) return null;

  return (
    <div className={css.result}>
      {timeLeft > 0 && <h2>Generating Results</h2>}
      {timeLeft === 0 && result !== -1 && (
        <>
          <h2>Result - {result}</h2>
          <h3>
            You placed ${getTotalBet()} & won total ${overallWin}
          </h3>
        </>
      )}
    </div>
  );
}

export default Result;
