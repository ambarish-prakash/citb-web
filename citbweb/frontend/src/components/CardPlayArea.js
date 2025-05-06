import React, { useState, useEffect } from 'react';

const CardPlayArea = ({playedMoves, startingPlayerIdx}) => {
    const [leftMove, setLeftMove] = useState(-1);
    const [topMove, setTopMove] = useState(-1);
    const [rightMove, setRightMove] = useState(-1);
    const [bottomMove, setBottomMove] = useState(-1);

    useEffect(() => {
        const extendedPlayedMoves = [...playedMoves, ...Array(4 - playedMoves.length).fill(-1)];
        setLeftMove(extendedPlayedMoves[(startingPlayerIdx + 0) % 4]);
        setTopMove(extendedPlayedMoves[(startingPlayerIdx + 1) % 4])
        setRightMove(extendedPlayedMoves[(startingPlayerIdx + 2) % 4]);
        setBottomMove(extendedPlayedMoves[(startingPlayerIdx + 3) % 4]);
    });

    return (
        <div className="card-play-area" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
          <div className="card">{leftMove}</div>
        </div>
      );
};

export default CardPlayArea;