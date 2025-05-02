import React, { useState } from 'react';
import PlayerBoard from './PlayerBoard';
import FilterNoneIcon from '@mui/icons-material/FilterNone';
import Filter1Icon from '@mui/icons-material/Filter1';
import Filter2Icon from '@mui/icons-material/Filter2';
import Filter3Icon from '@mui/icons-material/Filter3';
import Filter4Icon from '@mui/icons-material/Filter4';
import Filter5Icon from '@mui/icons-material/Filter5';
import Filter6Icon from '@mui/icons-material/Filter6';
import Filter7Icon from '@mui/icons-material/Filter7';
import Filter8Icon from '@mui/icons-material/Filter8';

const PlayerInfo = ({ playerInfo, canBet, gameId, playerSymbol, isStartingPlayer }) => {
    const [betValue, setBetValue] = useState(playerInfo.bet);

    const handleBetSelected = (newValue) => {
        setBetValue(newValue);
    };

    const submitBet = async (event) => {
        event.preventDefault();
        try {
          const action = betValue + 7;
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
    }

    const renderIconAndTooltip = () => {
      switch (playerInfo.collected_sets) {
        case 0:
          return {
            icon: <FilterNoneIcon className="player-sets-collected-icon" />,
            tooltip: "0 sets collected",
          };
        case 1:
          return {
            icon: <Filter1Icon className="player-sets-collected-icon" />,
            tooltip: "1 set collected",
          };
        case 2:
          return {
            icon: <Filter2Icon className="player-sets-collected-icon" />,
            tooltip: "2 sets collected",
          };
        case 3:
          return {
            icon: <Filter3Icon className="player-sets-collected-icon" />,
            tooltip: "3 sets collected",
          };
        case 4:
          return {
            icon: <Filter4Icon className="player-sets-collected-icon" />,
            tooltip: "4 sets collected",
          };
        case 5:
          return {
            icon: <Filter5Icon className="player-sets-collected-icon" />,
            tooltip: "5 sets collected",
          };
        case 6:
          return {
            icon: <Filter6Icon className="player-sets-collected-icon" />,
            tooltip: "6 sets collected",
          }
        case 7:
          return {
            icon: <Filter7Icon className="player-sets-collected-icon" />,
            tooltip: "7 sets collected",
          }
        case 8:
          return {
            icon: <Filter8Icon className="player-sets-collected-icon" />,
            tooltip: "8 sets collected",
          } 
        default:
          return {
            icon: null, // or return a default icon if needed
            tooltip: "- sets collected",
          };
      }
    };

    const startingPlayerIcon = () => {
      switch (isStartingPlayer) {
        case true:
          return "👑";
        default:
          return "";
      }
    };
  
    // Destructure the result of renderIconAndTooltip
    const { icon, tooltip } = renderIconAndTooltip();

    return (
        <div className='player-info-container'>
            <div className='player-name-div'>
              <span className="starting-player-tooltip" title="Starting Player">{startingPlayerIcon()}</span> {playerInfo.nickname} - {playerSymbol}
            </div>
            <PlayerBoard colors={playerInfo.valid_colors} canBet={canBet} betValue={betValue} onUpdateBet={handleBetSelected}/>
            <div className="player-sets-collected">
              {icon}
              <span className="sets-collected-tooltip">{tooltip}</span>
            </div>
            {canBet && <button onClick={submitBet} disabled={betValue === 0}> Bet {betValue} </button>}
        </div>
    );
}

export default PlayerInfo;
