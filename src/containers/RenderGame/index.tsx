'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Result from '../../components/Result';
import Header from '../../components/Header';
import PlaceBets from '../../components/PlaceBets';
import { tick } from '../../redux/slices/timer.slice';

import css from './index.module.scss';
import GameHistory from '../../components/GameHistory';

function RenderGame() {
  const dispatch = useDispatch();

  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch(tick({ time: 1 }));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  return (
    <div className={css.renderGame}>
      <Header />
      <h2 className={css.gameTitle}>Welcome to Dice Betting Game</h2>
      <PlaceBets />
      <Result />
      <GameHistory />
    </div>
  );
}

export default RenderGame;
