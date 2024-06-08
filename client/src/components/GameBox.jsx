import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_ALL_GAMES, GET_GAME } from '../utils/queries';
import StarboyGame from './starboyGame';

const gameBox = () => {

    const { gameId } = useParams();

    const { loading, data } = useQuery(GET_GAME,
        {
            variables: { gameId: gameId  }
        }
    );

    if (loading) {
        return <div>Loading...</div>;
    }

    console.log(data);
    console.log(data.singleGame.path);

    const renderGame = (path) => {
        switch(path) {
            case './starboyGame.jsx':
                return <StarboyGame />;
            // add other cases here for other games
            default:
                return null;
        }
    }

    return (
        <div className="game-container">
            {renderGame(data.singleGame.path)}
        </div>
    );
}

export default gameBox;