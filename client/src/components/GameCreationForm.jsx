import React, { useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { ADD_GAME, UPDATE_GAME } from '../utils/mutations';
import { GET_GAME, GET_USERS_BY_USERNAME } from '../utils/queries';

const GameCreationForm = () => {
	const [gameTitle, setGameTitle] = React.useState('');
	const [bannerImg, setBannerImg] = React.useState('');
	const [devs, setDevs] = React.useState([]);
	const [devIds, setDevIds] = React.useState([]);
	const [devsInput, setDevsInput] = React.useState('');
	const [addGame] = useMutation(ADD_GAME);
	const [updateGame] = useMutation(UPDATE_GAME);

	const { gameId } = useParams();

	const {
		loading: gameLoading,
		error: gameError,
		data: gameData,
	} = useQuery(GET_GAME, {
		variables: { gameId: gameId },
		skip: !gameId,
	});

	const {
		loading: devsLoading,
		error: devsError,
		data: devsData,
	} = useQuery(GET_USERS_BY_USERNAME, {
		variables: { username: devs },
		skip: !devs.length,
	});

	if (devsError) {
		console.error(devsError);
	}

	useEffect(() => {
		if (gameData && gameData.game && gameData.game.devs) {
			setGameTitle(gameData.game.title);
			setBannerImg(gameData.game.bannerImg);
			setDevs(gameData.game.devs.map((dev) => dev.username));
		}
	});

	useEffect(() => {
		if (devsData && devsData.devs) {
			setDevIds(devsData.devs.map((dev) => dev.id));
		}
	}, [devsData]);

	const handleFormSubmit = async (event) => {
		event.preventDefault();

		if (gameLoading || devsLoading) {
			return;
		}

		setDevs(devsInput.split(',').map((dev) => dev.trim()));

		if (!gameData || !gameData.game) {
			// The gameId was undefined or invalid, so create a new game
			try {
				await addGame({
					variables: {
						title: gameTitle,
						bannerImg: bannerImg,
						devs: devIds,
					},
				});
			} catch (e) {
				console.error(e);
			}
		} else {
			// The gameId was valid, so update the existing game
			try {
				await updateGame({
					variables: {
						gameId: gameId,
						title: gameTitle,
						bannerImg: bannerImg,
						devs: devIds,
					},
				});
			} catch (e) {
				console.error(e);
			}
		}
	};

	const handleChange = (event) => {
		const { name, value } = event.target;
		if (name === 'devs') {
			setDevsInput(value);
		} else if (name === 'gameTitle') {
			setGameTitle(value);
		} else {
			setBannerImg(value);
		}
	};

	return (
		<div className="game-form">
			<h2>{gameData && gameData.game ? 'Update Game' : 'Add Game'}</h2>
			<form onSubmit={handleFormSubmit}>
				<div className="form-group">
					<label htmlFor="gameTitle">Game Title:</label>
					<input
						className="form-input"
						placeholder="Game Title"
						name="gameTitle"
						type="text"
						id="gameTitle"
						onChange={handleChange}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="bannerImg">Banner Image URL:</label>
					<input
						className="form-input"
						placeholder="Banner Image"
						name="bannerImg"
						type="text"
						id="bannerImg"
						onChange={handleChange}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="devs">Developers:</label>
					<input
						className="form-input"
						placeholder="Developers (comma separated)"
						name="devs"
						type="text"
						id="devs"
						value={devsInput}
						onChange={handleChange}
					/>
				</div>
				<button
					className="form-btn"
					type="submit"
					style={{ cursor: 'pointer' }}
					disabled={gameLoading || devsLoading}
				>
					Submit
				</button>
			</form>
		</div>
	);
};

export default GameCreationForm;
