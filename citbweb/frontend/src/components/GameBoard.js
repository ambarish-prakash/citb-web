import React from 'react';

const GameBoard = ({ gameId, board, validMoves, playerColors, playerSymbols }) => {
    const defaultColors = ['FireBrick', 'MediumBlue', 'SeaGreen', 'Gold'];
    const symbols = playerSymbols;


    const playable = (move) => {
        return validMoves && validMoves.includes(move);
    }

    const playMove = async (event, move) => {
      event.preventDefault();
      try {
        const action = move + 11;
        const response = await fetch(`/api/game/${gameId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            action: action,
            player_number: 0 
          }),
        });
        if (!response.ok) {
          throw new Error('Failed to submit text');
        }
        window.location.reload();
      } catch (error) {
        console.error('Error submitting text:', error);
      }
    };

    return (
      <div className="game-board-container">
        {board.map((row, row_index) => (
            <div className="game-board-row" key={row_index}>
                {row.map((number, col_index) => (
                    <div key={`${row_index}-${col_index}`}
                         className={`game-board-square ${playable(row_index*8 + col_index) ? 'playable' : ''}`}
                         style={{ 
                            backgroundColor: defaultColors[row_index],
                            borderColor: defaultColors[row_index],
                            }} 
                         onClick={(event) => {
                            if (playable(row_index*8 + col_index)) {
                              playMove(event, row_index*8 + col_index);
                            }
                          }}>
                        {col_index+1}
                        {number > 0 && <div className="symbol" style={{
                            color: playerColors[number-1],
                        }}>{symbols[number-1]}</div>}
                    </div>
                ))}
            </div>
        ))}
      </div>
    );
  };
  
  export default GameBoard;
