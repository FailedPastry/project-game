import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import nipplejs from 'nipplejs';

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

	const options = {
		zone: document.getElementById('joystick-container'),
		mode: 'static',
		position: { top: '50%', left: '50%' },
		color: 'red'
	};

	window.addEventListener('keydown', function(e) {
		if(e.keyCode == 32 && e.target == document.body) {
		  e.preventDefault();
		}
	  });

	// const manager = nipplejs.create(options);

	// manager.on('dir', (event, nipple) => {

	// });

	return (
		<div className="play-container">
			<img className="play-banner" src={data?.singleGame?.bannerImg} alt={data?.singleGame?.title} />
			<div className="gamebox-container">
				<GameBox />
			</div>
			{/* <div className="joystick-container">

			</div> */}
			<img className="control-banner" src="/img/gameControlArt.png" alt="game controls graphic" />
			<div className="game-info">
				<h2>{data?.singleGame?.title}</h2>
				<p>{data?.singleGame?.description}</p>
				<p>{data?.singleGame?.controlsGuide}</p>
				<h3>Developed By:</h3>
				<div className="devs-list">
					{data?.singleGame?.devs.map(dev => (
						<Link to={`/profile/${dev._id}`} key={dev._id}>{dev.username}</Link>
					))}
				</div>
				<Link to="/games">Back to Games</Link>
			</div>
		</div>
	);
}

export default PlayGamePage;