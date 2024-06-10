import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Link, useParams } from 'react-router-dom';
import Modal from 'react-modal';

import { GET_SINGLE_USER } from '../utils/queries';
import { DELETE_GAME } from '../utils/mutations';
import Auth from '../utils/auth';
import PrivateProfileSection from '../components/PrivateProfileSection';

const Profile = () => {

	Modal.setAppElement('#root');
	const [isMyProfile, setIsMyProfile] = React.useState(false);
	const [isOpen, setIsOpen] = React.useState(false);
	const [gameIdToDelete, setGameIdToDelete] = React.useState(null);
	const [deleteGame] = useMutation(DELETE_GAME);

	const customStyles = {
		content: {
		  top: '50%',
		  left: '50%',
		  right: 'auto',
		  bottom: 'auto',
		  marginRight: '-50%',
		  transform: 'translate(-50%, -50%)',
		  backgroundColor: '#292f31',
		  padding: '20px',
		  borderRadius: '10px',

		},
	};

	const myProfile = Auth.loggedIn() ? Auth.getProfile() : null;
	const { userId } = useParams();
	const currentProfile = userId || myProfile?.data?._id;

	React.useEffect(() => {
		if (myProfile?.data?._id === currentProfile) {
		  setIsMyProfile(true);
		}
	  }, [myProfile?.data?._id, currentProfile]
	);

	const { loading, data } = useQuery(GET_SINGLE_USER, {
		variables: { userId: currentProfile }
	});

	if (loading) {
		return <div>Loading...</div>;
	}

	if (!data) {
		return <div>No data</div>;
	}

	const sortedScores = data.user.scores.slice().sort((a, b) => b.score - a.score);

	const handleOpenModal = (gameId) => {
		setGameIdToDelete(gameId);
		setIsOpen(true);
	}

	const handleCloseModal = () => {
		setIsOpen(false);
	}

	const handleDeleteGame = async (gameId) => {
		try {
			await deleteGame({
				variables: { gameId: gameId }
			});
			window.location.reload();
		} catch (e) {
			console.error(e);
		}
	}
	

	return (
		<div className="profile">
			<h2>Profile</h2>
			<div className='avatar'>
				<img src="/img/profile.png" alt='avatar' />
				<h2>{data?.user?.username || "username"}</h2>
			</div>
			<div className="favGame">

			</div>
			<div className="highScores">
				<h3>High Scores:</h3>
				<div className="highScore1">
					{sortedScores[0]?.game?.title || "Game"}:{' '}
					{sortedScores[0]?.score || 0}
				</div>
				<div className="highScore2">
					{sortedScores[1]?.game?.title || "Game"}:{' '}
					{sortedScores[1]?.score || 0}
				</div>
				<div className="highScore3">
					{sortedScores[2]?.game?.title || "Game"}:{' '}
					{sortedScores[2]?.score || 0}
				</div>
			</div>
			<div className="bio">
			
			</div>
			<div className="portfolio">
				<h3>My Games</h3>
				{ data.user.games.length != 0 ?
					data.user.games.map(game => (
						<>
						<div key={game._id}>
							<Link to={`/games/${game._id}`}>
								<img className="portfolio-banner" src={game.bannerImg} alt={game.title} />
							</Link>
						</div>
						{isMyProfile ? 
							<div className="edit-game">
								<Link to={`/profile/edit_game/${game._id}`}>Edit</Link>
								<button onClick={() => handleOpenModal(game._id)}>Delete</button>
							</div> 
							: null}
						</>
					))
					: <h4>No games uploaded</h4>
				}
			</div>
			<div className="links">
				
			</div>
			{isMyProfile && <PrivateProfileSection /> ? 
				<PrivateProfileSection /> : null
			}
			<Modal
				isOpen={isOpen}
				onRequestClose={handleCloseModal}
				contentLabel="Delete Game"
				style={customStyles}
			>
				<h2>Are you sure you want to delete this game?</h2>
				<button onClick={handleCloseModal} className="form-btn">Cancel</button>
				<button onClick={() => handleDeleteGame(gameIdToDelete)} className="form-btn">Delete</button>
			</Modal>
		</div>

	);
}

export default Profile;