import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { GET_GAME, GET_USERS_BY_USERNAME } from '../utils/queries';
import GameBox from '../components/GameBox';

const PlayGamePage = () => {

	const { gameId } = useParams();

	const { loading, data } = useQuery(GET_GAME, {
		variables: { gameId: gameId }
	});

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<img className="play-banner" src={data?.singleGame?.bannerImg} alt={data?.singleGame?.title} />
			<div className="gamebox-container">
				<GameBox />
			</div>
			<div className="game-info">
				<h2>{data?.singleGame?.title}</h2>
				<h2>Developed By:</h2>
				{data?.singleGame?.devs.map(dev => (
					<Link to={`/profile/${dev._id}`} key={dev._id}>{dev.username}</Link>
				))}
				<Link to="/games">Back to Games</Link>
			</div>
		</div>
	);
}

export default PlayGamePage;