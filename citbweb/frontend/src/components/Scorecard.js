import React, { useState, useEffect } from 'react';


const Scorecard = ({ playerInfo, roundNumber, gameId, isHidden, hideScorecardParent }) => {
    const [hide, setHide] = useState(isHidden);

    useEffect(() => {
        setHide(isHidden);
    }, [isHidden]);

    const getText = () => {
        return `Start Round ${roundNumber + 2}!`;
    };

    const startNextRound = async (event) => {
        event.preventDefault();
        try {
          const response = await fetch(`/api/game/${gameId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              action: 'nextRound',
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

    const hideScorecard = () => {
        setHide(true);
        hideScorecardParent();
    }

    const shouldDisplay = () => {
        return !hide;
    }

    return (
        <div className={`scorecard-container ${shouldDisplay() ? '' : 'scorecard-hidden'}`}>
            <div className='scorecard-close' onClick={hideScorecard}>X</div>
            <div className='scorecard-heading'> {roundNumber === 2 && 'Final'} Scores: </div>
            <div className='scorecard-table-container'>
                <table>
                    <thead>
                    <tr>
                        <th rowSpan="2">Player</th>
                        {playerInfo[0].scores.map((_s, i) => (
                            <th colSpan="2">Round {i+1}</th>
                        ))}
                        <th rowSpan="2">Overall</th>
                    </tr>
                    <tr>
                        {playerInfo[0].scores.map((_s, i) => (
                            <React.Fragment key={i*50+i}>
                                <th>Sets</th>
                                <th>Bonuses</th>
                            </React.Fragment>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                        {playerInfo.map((player, index) => (
                            <tr key={index}>
                                <td>{player.nickname}</td>
                                {player.scores.map((score, i) => (
                                    <React.Fragment key={index*10+i}>
                                        <td key={`score-${index}-${i}`}>{score}</td>
                                        <td key={`bonus-${index}-${i}`}>{player.bonuses[i]}</td>
                                    </React.Fragment>
                                ))}
                                <td>{player.overall_score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div>
                {roundNumber <= 1 && (
                    <button onClick={startNextRound}>{getText()}</button>
                )}
            </div>
        </div>
    );
}


export default Scorecard;
