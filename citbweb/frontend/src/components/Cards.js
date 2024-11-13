import React, { useState } from 'react';

const Cards = ({cards, canDiscard, gameId}) => {
    const [selectedCard, setSelectedCard] = useState(-1);

    const selectCard = (idx) => () => {
        if (!canDiscard){
            return;
        }
        setSelectedCard(idx);
    };

    const discardCard = async (event) => {
        event.preventDefault();
        try {
          const action = cards[selectedCard] - 1;
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
          setSelectedCard(-1);
          window.location.reload();
        } catch (error) {
          console.error('Error submitting text:', error);
        }
        
    };

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

    const createCards = () => {
        const card_divs = [];
        for (let i = 0; i < cards.length; i++) {
            const val = cards[i]
            card_divs.push(<div key={i} 
                                className={i === selectedCard ? 'card card-selected' : 'card'}
                                style={{ '--i': i, '--base': (cards.length-1)/2 }}
                                onClick={selectCard(i)}> 
                                    {val} 
                            </div>);
        }
        return card_divs;
    };

    return (
        <div className='cards-container'>
            {/* {
                cards.map((value, idx) => (
                    <div key={idx} className='card'>
                        {value}
                    </div>
                ))
            } */}
            {createCards()}
            {canDiscard && (
                <div>
                    <button disabled={selectedCard === -1} onClick={discardCard}>
                        Discard {cards[selectedCard]}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Cards;
