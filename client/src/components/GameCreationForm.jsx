import React, { useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useParams, useNavigate } from 'react-router-dom';
import { ADD_GAME } from '../utils/mutations';
import { GET_USERS_BY_USERNAME } from '../utils/queries';

const GameCreationForm = () => {
	const [gameTitle, setGameTitle] = React.useState('');
	const [bannerImg, setBannerImg] = React.useState('');
	const [devs, setDevs] = React.useState([]);
	const [devIds, setDevIds] = React.useState([]);
	const [devsInput, setDevsInput] = React.useState('');
	const [description, setDescription] = React.useState('');
	const [controlsGuide, setControlsGuide] = React.useState('');
	const [path, setPath] = React.useState('');
	const [addGame] = useMutation(ADD_GAME);

	const navigate = useNavigate();

	useEffect(() => {
		setDevs(devsInput.split(',').map((dev) => dev.trim()));
		console.log('Devs after setting from the devs input:', devs);
	}, [devsInput]);

	const {
		loading: devsLoading,
		error: devsError,
		data: devsData,
	} = useQuery(GET_USERS_BY_USERNAME, {
		variables: { username: devs },
		skip: !devs.length,
	});

	console.log('Query data:', devsData);

	if (devsError) {
		console.error(devsError);
	}

	console.log('Devs map test:', devsData?.getUsersByUsername?.map((dev) => dev._id));

	useEffect(() => {
		if (devsData && devsData?.getUsersByUsername) {
			const newDevIds = devsData?.getUsersByUsername?.map((dev) => dev._id);
			setDevIds(newDevIds);
			console.log('DevIds after setting from the devs data:', devIds);
		}
	}, [devsData]);

	const handleFormSubmit = async (event) => {
		event.preventDefault();

		if (devsLoading) {
			return;
		}

		console.log('Submitting game:', gameTitle, description, controlsGuide, bannerImg, path, devIds);

		try {
			await addGame({
				variables: {
					title: gameTitle,
					description: description,
					controlsGuide: controlsGuide,
					bannerImg: bannerImg,
					path: path,
					devs: devIds,
				},
			});

			navigate('/profile');
		} catch (e) {
			console.error(e);
		}
	};

	const handleChange = (event) => {
		const { name, value } = event.target;
		if (name === 'devs') {
			setDevsInput(value);
		} else if (name === 'gameTitle') {
			setGameTitle(value);
		} else if (name === 'bannerImg') {
			setBannerImg(value);
		} else if (name === 'description') {
			setDescription(value);
		} else if (name === 'controlsGuide') {
			setControlsGuide(value);
		} else if (name === 'path') {
			setPath(value);
		}
	};

	return (
		<div className="game-form">
			<h2>Add Game</h2>
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
					<label htmlFor="description">Description:</label>
					<input
						className="form-input"
						placeholder="Description"
						name="description"
						type="text"
						id="description"
						onChange={handleChange}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="controlsGuide">Controls Guide:</label>
					<input
						className="form-input"
						placeholder="Controls Guide"
						name="controlsGuide"
						type="text"
						id="controlsGuide"
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
				<div className="form-group">
					<label htmlFor="path">Path:</label>
					<input
						className="form-input"
						placeholder="Path"
						name="path"
						type="text"
						id="path"
						onChange={handleChange}
					/>
				</div>
				<button
					className="form-btn"
					type="submit"
					style={{ cursor: 'pointer' }}
					disabled={devsLoading}
				>
					Submit
				</button>
			</form>
		</div>
	);
};

export default GameCreationForm;
