import React, { useState, useEffect } from 'react';

const CardPlayArea = ({playedMoves, startingPlayerIdx}) => {
    const [leftNumber, setLeftNumber] = useState(0);
    const [leftColor, setLeftColor] = useState('');

    const [topNumber, setTopNumber] = useState(0);
    const [topColor, setTopColor] = useState('');

    const [rightNumber, setRightNumber] = useState(0);
    const [rightColor, setRightColor] = useState('');

    const [bottomNumber, setBottomNumber] = useState(0);
    const [bottomColor, setBottomColor] = useState('');

    const getNumberAndColor = (move) => {
        if (move === -1) {
            return { number: 0, color: '' };
        }
        const number = (move % 8) + 1;
        const colorIdx = Math.floor(move / 8); // Use Math.floor to get the integer part
        const color = ['red', 'blue', 'green', 'yellow'][colorIdx]
        return {number, color};
    };

    useEffect(() => {
        const extendedPlayedMoves = [...playedMoves, ...Array(4 - playedMoves.length).fill(-1)];
        
        const leftMove = extendedPlayedMoves[(4 - startingPlayerIdx) % 4];
        const topMove = extendedPlayedMoves[(5 - startingPlayerIdx) % 4];
        const rightMove = extendedPlayedMoves[(6 - startingPlayerIdx) % 4];
        const bottomMove = extendedPlayedMoves[(7 - startingPlayerIdx) % 4];
      
        const updateCard = (move, setNumber, setColor) => {
          if (move === -1) {
            setNumber(0);
            setColor('');
          } else {
            const { number, color } = getNumberAndColor(move);
            setNumber(number);
            setColor('played-card-' + color);
          }
        };
      
        updateCard(leftMove, setLeftNumber, setLeftColor);
        updateCard(topMove, setTopNumber, setTopColor);
        updateCard(rightMove, setRightNumber, setRightColor);
        updateCard(bottomMove, setBottomNumber, setBottomColor);
      });

    return (
        <div className="card-play-area">
            {leftNumber !== 0 && (
                <div className={`played-card ${leftColor} played-card-left`}>{leftNumber}</div>
            )}
            {topNumber !== 0 && (
                <div className={`played-card ${topColor} played-card-top`}>{topNumber}</div>
            )}
            {rightNumber !== 0 && (
                <div className={`played-card ${rightColor} played-card-right`}>{rightNumber}</div>
            )}
            {bottomNumber !== 0 && (
                <div className={`played-card ${bottomColor} played-card-bottom`}>{bottomNumber}</div>
            )}
        </div>
      );
};

export default CardPlayArea;
