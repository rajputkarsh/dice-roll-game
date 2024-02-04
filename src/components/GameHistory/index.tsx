import { useSelector } from 'react-redux';
import { AppState } from '../../redux/store';
import { isTimerRunning } from '../../redux/slices/timer.slice';

import css from './index.module.scss';
import { IGameHistory, getGameHistory } from '../../redux/slices/game.slice';

function GameHistory() {
  const timerRunning = useSelector<AppState, boolean>(isTimerRunning);
  const gameHistory = useSelector<AppState, Array<IGameHistory>>(
    getGameHistory
  );

  if (timerRunning) return null;
  if (!gameHistory.length) return null;

  return (
    <div className={css.gameHistory}>
      <h2>Game History</h2>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Bets</th>
            <th>Total Bet</th>
            <th>Won</th>
            <th>Total Won</th>
          </tr>
        </thead>
        <tbody>
          {gameHistory.map((history, index) => {
            const totalBet = history.bets.reduce((total, bet) => {
              return total + bet.amountPlaced;
            }, 0);

            return (
              <tr>
                <td>{index + 1}</td>
                <td>
                  {history.bets.map((bet, index) => {
                    return bet.amountPlaced > 0 ? (
                      <div>
                        {index + 1}) {bet.diceNumber} - ${bet.amountPlaced} (
                        {bet.won ? 'WON' : 'LOST'})
                      </div>
                    ) : (
                      ''
                    );
                  })}
                </td>
                <td>{totalBet}</td>
                <td>{history.winAmount}</td>
                <td>{totalBet - history.winAmount}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default GameHistory;
