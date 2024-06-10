import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_GAME, GET_USERS_BY_USERNAME } from '../utils/queries';
import { UPDATE_GAME } from '../utils/mutations';

const GameEditForm = () => {
	const { gameId } = useParams();
	const { loading, data } = useQuery(GET_GAME, {
		variables: { gameId: gameId }
	});

    const [gameTitle, setGameTitle] = React.useState('');
    const [bannerImg, setBannerImg] = React.useState('');
    const [devs, setDevs] = React.useState([]);
    const [devIds, setDevIds] = React.useState([]);
    const [devsInput, setDevsInput] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [controlsGuide, setControlsGuide] = React.useState('');
    const [path, setPath] = React.useState('');
    const [updateGame] = useMutation(UPDATE_GAME);

    const navigate = useNavigate();

    useEffect(() => {
        if (data) {
            setGameTitle(data.singleGame.title);
            setBannerImg(data.singleGame.bannerImg);
            setDevs([data.singleGame.devs.map((dev) => dev.username).join(', ')]);
            setDevIds([data.singleGame.devs.map((dev) => dev._id)]);
            setDevsInput(data.singleGame.devs.map((dev) => dev.username).join(', '));
            setDescription(data.singleGame.description);
            setControlsGuide(data.singleGame.controlsGuide);
            setPath(data.singleGame.path);
        }
    }, [data]);

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

		if (devsLoading || loading) {
			return;
		}

		console.log('Submitting game:', gameTitle, description, controlsGuide, bannerImg, path, devIds);

		console.log('Type of path:', typeof path);

		try {
			await updateGame({
				variables: {
					gameId: gameId,
					title: gameTitle,
					description: description,
					controlsGuide: controlsGuide,
					bannerImg: bannerImg,
					devs: devIds,
					path: path,
				}
			});
			navigate(`/game/${gameId}`);
		} catch (e) {
			console.error(e);
		}
	};

	const handleChange = (event) => {
		const { name, value } = event.target;
		switch (name) {
			case 'gameTitle':
				setGameTitle(value);
				break;
			case 'bannerImg':
				setBannerImg(value);
				break;
			case 'devs':
				setDevsInput(value);
				break;
			case 'description':
				setDescription(value);
				break;
			case 'controlsGuide':
				setControlsGuide(value);
				break;
			case 'path':
				setPath(value);
				break;
			default:
				break;
		}
	};

	return (
		<div className="game-form">
			<h2>Update Game</h2>
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
						value={gameTitle}
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
						value={description}
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
						value={controlsGuide}
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
						value={bannerImg}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="devs">Developers:</label>
					<input
						className="form-input"
						placeholder="Developers"
						name="devs"
						type="text"
						id="devs"
						onChange={handleChange}
						value={devsInput}
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
						value={path}
					/>
				</div>
				<button 
					className='form-btn'
					type='submit'
					style={{ cursor: 'pointer' }}
					disabled={devsLoading || loading}
				>
					Update Game
				</button>
			</form>
		</div>
	)

}

export default GameEditForm;