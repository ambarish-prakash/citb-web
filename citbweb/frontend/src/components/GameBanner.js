import React from 'react';

const GameBanner = ( {bannerText} ) => {
    return (
        <div className="game-banner">
            <div> { bannerText } </div>
            <div className="game-banner-line"></div>
        </div>
    );
}

export default GameBanner;