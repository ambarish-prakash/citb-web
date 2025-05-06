import React, { useState, useEffect } from 'react';

const PlayerBoard = ({ colors, canBet, betValue, onUpdateBet }) => {
    const [betVal, setBetVal] = useState(betValue);

    const getColor = (idx, color) => {
        if (colors[idx]) {
            return color;
        }
        return 'gray';
    };

    const updateBet = (newBet) => {
        if (!canBet) {
            return;
        }
        onUpdateBet(newBet);
        setBetVal(newBet);
    };

    const getBetClassName = (betNumber) => {
      if (canBet && betVal === 0) {
        return 'player-board-bet bet-to-select';
      } else if (betVal === betNumber) {
        return 'player-board-bet bet-selected';
      } else {
        return 'player-board-bet';
      }
    };

  return (
    <div className='player-board-container'>
      <div className='player-board-color player-board-top' style={{ backgroundColor: getColor(0, 'FireBrick') }}> R </div>
      <div className='player-board-color player-board-right' style={{ backgroundColor: getColor(1, 'MediumBlue') }}> B </div>
      <div className='player-board-color player-board-left' style={{ backgroundColor: getColor(2, 'SeaGreen') }}> G </div>
      <div className='player-board-color player-board-bottom' style={{ backgroundColor: getColor(3, 'Gold') }}> Y </div>

      <div className='player-board-bets'>
        <div className={getBetClassName(1)}
          onClick={() => updateBet(1)}>
          1
        </div>
        <div className={getBetClassName(2)}
          onClick={() => updateBet(2)}>
          2
        </div>
        <div className={getBetClassName(3)}
          onClick={() => updateBet(3)}>
          3
        </div>
      </div>
    </div>
  );
};

export default PlayerBoard;
