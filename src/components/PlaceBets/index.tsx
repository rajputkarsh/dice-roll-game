import { useSelector, useDispatch } from 'react-redux';
import {
  ICurrentBet,
  IDiceNumber,
  getBalance,
  getCurrentBet,
  placeAmountOnDice,
  resetCurrentBet,
} from '../../redux/slices/game.slice';
import { AppState } from '../../redux/store';

import css from './index.module.scss';
import {
  getTimeLeft,
  getTimerTitle,
  isTimerRunning,
  start,
} from '../../redux/slices/timer.slice';

export const BETTING_TIME = 10;
export const BETTING_TIMER_TITLE = 'BETTING';

function PlaceBets() {
  const dispatch = useDispatch();
  const currentBet = useSelector<AppState, ICurrentBet>(getCurrentBet);
  const currentBalance = useSelector<AppState, number>(getBalance);

  const timerRunning = useSelector<AppState, boolean>(isTimerRunning);
  const timerTitle = useSelector<AppState, string>(getTimerTitle);
  const timeLeft = useSelector<AppState, number>(getTimeLeft);

  const startTimer = () => {
    dispatch(start({ time: BETTING_TIME, title: BETTING_TIMER_TITLE }));
  };

  const getBetValueOnDice = (diceNumber: IDiceNumber): number => {
    return currentBet[diceNumber].amountPlaced;
  };

  const getTotalBetExcludingDiceNumber = (diceNumber: IDiceNumber): number => {
    return Object.entries(currentBet).reduce((totalAmount, [dice, bet]) => {
      if (diceNumber === dice) return totalAmount;
      return totalAmount + Number(bet.amountPlaced);
    }, 0);
  };

  const placeBetOnDice = (diceNumber: IDiceNumber, amount: number): void => {
    const currentTotalBet = getTotalBetExcludingDiceNumber(diceNumber);

    if (currentBalance < currentTotalBet + amount) {
      alert('Action not possible');
      return;
    }

    dispatch(placeAmountOnDice({ diceNumber, amount }));
  };

  return (
    <div className={css.placeBets}>
      {timerRunning ? (
        <>
          <div className={css.betTitles}>
            <h2>Place your bets</h2>
            <h3>Time Left:- {timeLeft}</h3>
          </div>
          <div className={css.dieRow}>
            {Object.keys(currentBet).map((diceNumber: string) => (
              <div className={css.dice}>
                <span>Number : {diceNumber}</span>
                <img src={`./dice${diceNumber}.png`} />
                <input
                  type="number"
                  value={getBetValueOnDice(diceNumber as IDiceNumber)}
                  disabled={
                    timerTitle !== BETTING_TIMER_TITLE || timeLeft === 0
                  }
                  onChange={(e) =>
                    placeBetOnDice(
                      diceNumber as IDiceNumber,
                      Number(e.target.value)
                    )
                  }
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <button
          onClick={() => {
            dispatch(resetCurrentBet());
            startTimer();
          }}
        >
          Start Game
        </button>
      )}
    </div>
  );
}

export default PlaceBets;
