import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_ALL_GAMES, GET_GAME } from '../utils/queries';
import StarboyGame from './starboyGame';
import InvadersGame from './invadersGame';

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
            case './invadersGame.jsx':
				return <InvadersGame />;
            default:
                return (
					<div className="empty-frame">
						<h1>Coming Soon!</h1>
					</div>
				);
        }
    }

    return (
        <div className="game-container">
            {renderGame(data.singleGame.path)}
        </div>
    );
}

export default gameBox;