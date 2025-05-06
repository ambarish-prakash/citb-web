import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GameBoard from './GameBoard';
import PlayArea from './PlayArea';
import PlayerInfo from './PlayerInfo';
import Cards from './Cards';
import Logs from './Logs';
import Scorecard from './Scorecard';
import GameBanner from './GameBanner';

const GamePage = () => {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [error, setError] = useState(null);
  const [text, setText] = useState('');
  const [bannerText, setBannerText] = useState('');
  const navigate = useNavigate();
  const playerColors = ['DimGray', 'Aquamarine', 'Chocolate', 'Orchid'];
  const playerSymbols = ['♠','♣','♦','♥'];
  const [dispScorecard, setDispScorecard] = useState(false);

  const backToHome = () => {
    navigate('/');
  }

  useEffect(() => {
    fetch(`/api/game?code=${gameId}`)
      .then(response => {
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Game not found");
          }
          throw new Error("An error occurred while fetching the game data");
        }
        return response.json();
      })
      .then(data => {
        setGame(data);
        if(data.round_over) {
          setDispScorecard(true);
        }
      })
      .catch(error => {
        setError(error.message);
      });
  }, [gameId]);

  useEffect(() => {
    if (game) {
      manageBannerText();
    }
  }, [game]);

  const getLeadScorers = () => {
    const maxScore = Math.max(...game.players.map(player => player.overall_score));
    const playersWithMaxScore = game.players.filter(player => player.overall_score === maxScore);
    return playersWithMaxScore.map(player => player.nickname);
  }

  const manageBannerText = () => {
    if (game.game_over === false  && game.round_over === true) {
      const leadScorers = getLeadScorers();
      let message;
      if (leadScorers.length === 1) {
        message = `Round Over. ${leadScorers[0]} is in the lead.`;
      } else {
        message = `Round Over. ${leadScorers.slice(0, -1).join(', ')}, and ${leadScorers[leadScorers.length - 1]} are in the lead.`;
      }
      setBannerText(message);
    } else if (game.turn_number === 0) {
      setBannerText('You must choose and discard a card');
    } else if (game.turn_number === 1) {
      setBannerText('You must set a bet');
    } else {
      setBannerText('You must play a card');
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`/api/game/${gameId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: text,
          player_number: 0 
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to submit text');
      }
      setText(''); // Clear the text input after submission
      window.location.reload();
    } catch (error) {
      console.error('Error submitting text:', error);
    }
  };

  const getValidPlayableMoves = () => {
    if (game.turn_number < 2  || game.round_over === true) {
      return [];
    }
    if (game.starting_player_idx === 0 && game.red_played === false) {
      return game.private_info.valid_moves.filter(move => move >= 8);
    }
    return game.private_info.valid_moves;
  }

  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error}</p>
        <button onClick={backToHome}>Back To Home</button>
      </div>
    );
  }

  if (!game) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  const showScorecard = () => {
    setDispScorecard(true);
  }

  const hideScorecard = () => {
    setDispScorecard(false);
  }

  return (
    <div className="game-page-column-container">
      { bannerText && (
        <div className='game-banner-container'>
          <GameBanner bannerText={bannerText} />
        </div> 
      )}
      <div className="game-page-container">
        <div className='game-container'>

          <div className='scorecard-toggle-container'>
            <div className='scorecard-toggle'>
              <button onClick={showScorecard}>Scorecard</button>
            </div>
          </div>

          <Scorecard  playerInfo={game.players}
                      roundOver={game.round_over}
                      roundNumber={game.round_number}
                      gameId={gameId}
                      isHidden={!dispScorecard}
                      hideScorecardParent={hideScorecard}
          />

          <GameBoard  gameId={gameId} 
                      board={game.board.places} 
                      validMoves={getValidPlayableMoves()} 
                      playerColors={playerColors}
                      playerSymbols={playerSymbols}
          />

          <PlayArea game={game} gameId={gameId} playerSymbols={playerSymbols} />

          {/* <div className='test-player'>
          {
            game.players.map((playerInfo, playerNumber) => (
              <PlayerInfo playerInfo={playerInfo} 
                          key={playerNumber}
                          canBet={playerNumber === 0 && game.turn_number === 1}
                          gameId={gameId}
                          playerSymbol={playerSymbols[playerNumber]}
              />
            ))
          }
          </div>

          <Cards cards={game.private_info.hand} canDiscard={game.turn_number === 0} gameId={gameId} />

          */}
          
          <p>Game Data: {JSON.stringify(game)}</p>
          <form onSubmit={handleSubmit}>
            <label>
              Action:
              <input
                type="text"
                value={text}
                onChange={(event) => setText(event.target.value)}
              />
            </label>
            <button type="submit">Perform</button>
          </form>

        </div>
        <div className='log-container'>
          <Logs logs={game.logs}/>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
