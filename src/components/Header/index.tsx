import { useDispatch, useSelector } from 'react-redux';
import {
  getBalance,
  getUserName,
  resetProgess,
} from '../../redux/slices/game.slice';
import { AppState } from '../../redux/store';

import css from './index.module.scss';
import { reset } from '../../redux/slices/timer.slice';

function Header() {
  const dispatch = useDispatch();

  const userName = useSelector<AppState, string>(getUserName);
  const balance = useSelector<AppState, number>(getBalance);

  const resetGameProgress = () => {
    dispatch(resetProgess());
    dispatch(reset());
    window.location.reload();
  };

  return (
    <div className={css.header}>
      <h2>Hello {userName}</h2>
      <span>
        <h2>Balance: ${balance}</h2>
        <button
          onClick={() => {
            resetGameProgress();
          }}
        >
          Reset Progess
        </button>
      </span>
    </div>
  );
}

export default Header;
