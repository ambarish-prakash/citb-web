import React from 'react';

const GameBanner = ( {bannerText} ) => {
    return (
        <div className="game-banner">
            { bannerText }
        </div>
    );
}

export default GameBanner;