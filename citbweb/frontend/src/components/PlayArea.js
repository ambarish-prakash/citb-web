import React, { useState, useEffect } from 'react';
import Cards from './Cards';
import PlayerInfo from './PlayerInfo';
import CardPlayArea from './CardPlayArea';

const PlayArea = ( {game, gameId, playerSymbols} ) => {
    const [players, setPlayers] = useState(game.players);
    const [playerNumbers, setPlayerNumbers] = useState(game.players.map(player => player.player_number));


    useEffect(() => {
        console.log(game);
    });

    return (
        <div className="play-area-container">
            <div className="left-player-area">
                <Cards cards={game.private_info.hand} canDiscard={game.turn_number === 0} gameId={gameId} />
                <PlayerInfo playerInfo={players[0]} 
                          key={playerNumbers[0]}
                          canBet={playerNumbers[0] === 0 && game.turn_number === 1}
                          gameId={gameId}
                          playerSymbol={playerSymbols[playerNumbers[0]]}
                          isStartingPlayer={game.starting_player_idx === 0}
                />
            </div>
            <div className="center-player-area">
                <PlayerInfo playerInfo={players[1]} 
                            key={playerNumbers[1]}
                            canBet={playerNumbers[1] === 0 && game.turn_number === 1}
                            gameId={gameId}
                            playerSymbol={playerSymbols[playerNumbers[1]]}
                            isStartingPlayer={game.starting_player_idx === 1}
                    />
                <CardPlayArea playedMoves={game.played_moves}
                              startingPlayerIdx={game.starting_player_idx}
                />
                <PlayerInfo playerInfo={players[3]} 
                            key={playerNumbers[3]}
                            canBet={playerNumbers[3] === 0 && game.turn_number === 1}
                            gameId={gameId}
                            playerSymbol={playerSymbols[playerNumbers[3]]}
                            isStartingPlayer={game.starting_player_idx === 3}
                />
            </div>
            <div className="right-player-area">
                <div style={{ height: '200px' }}></div>
                <PlayerInfo playerInfo={players[2]} 
                        key={playerNumbers[2]}
                        canBet={playerNumbers[2] === 0 && game.turn_number === 1}
                        gameId={gameId}
                        playerSymbol={playerSymbols[playerNumbers[2]]}
                        isStartingPlayer={game.starting_player_idx === 2}
                />
            </div>
        </div>
    );
}

export default PlayArea;