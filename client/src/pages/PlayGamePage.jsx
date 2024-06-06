import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { GET_GAME } from '../utils/queries';
import GameBox from '../components/GameBox';

const PlayGamePage = () => {

	const { gameId } = useParams();

	const { loading, data } = useQuery(GET_GAME, {
		variables: { gameId: gameId }
	});

	if (loading) {
		return <div>Loading...</div>;
	}

	console.log(data.singleGame.bannerImg);

	return (
		<div>
			<img className="play-banner" src={data?.singleGame?.bannerImg} alt={data?.singleGame?.title} />
			<div className="gamebox-container">
				<GameBox />
			</div>
		</div>
	);
}

export default PlayGamePage;