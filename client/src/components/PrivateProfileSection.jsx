import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import Auth from '../utils/auth';
import { GET_SINGLE_USER } from '../utils/queries';
import { UPDATE_USER } from '../utils/mutations';


const PrivateProfileSection = ({ user }) => {
	
	Modal.setAppElement('#root');
	const [isOpen, setIsOpen] = React.useState(false);
	const [password, setPassword] = React.useState('');
	const [confirmPassword, setConfirmPassword] = React.useState('');
	const [statusMessage, setStatusMessage] = React.useState('');

	const myProfile = Auth.getProfile();

	const { loading, data } = useQuery(GET_SINGLE_USER, {
		variables: { userId: myProfile.data._id }
	});

	const [updateUser, { error }] = useMutation(UPDATE_USER);

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

	

	const openModal = () => {
		setIsOpen(true);
	}

	const closeModal = () => {
		setIsOpen(false);
	}

	const handlePasswordChange = async (event) => {
		event.preventDefault();

		if (password === confirmPassword) {
			try {
				await updateUser({
					variables: {
						userId: myProfile.data._id,
						username: myProfile.data.username,
						email: myProfile.data.email,
						password: password
					}
				});
				setStatusMessage('Password updated successfully');
				setTimeout(closeModal, 2000);
			} catch (error) {
				console.error(error);
				setStatusMessage('Something went wrong');
			}
		} else {
			setStatusMessage('Passwords do not match');
		}
	};

	const handleChange = (event) => {
		const { name, value } = event.target;
		if (name === 'password') {
			setPassword(value);
		} else if (name === 'confirmPassword') {
			setConfirmPassword(value);
		}
	};

	

	return (
		<div className="profile">
			<h2>Private Section</h2>
			{data?.user?.scores.map((score, index) => (
				<div key={score._id} className="score_entry">
					<div className="game">{score.game.title}</div>
					<div className="score">{score.score}</div>
				</div>
			))}
			<div className="game_btns">
				<Link to="/profile/upload_game" className="profile_btn">New Game</Link>
				<button className="profile_btn">Edit Game</button>
				<button className="profile_btn">Delete Game</button>
			</div>
			<div className="profile_btns">
				<button onClick={openModal} className="profile_btn">Change Password</button>
				<button className="profile_btn">Delete Account</button>
			</div>
			<Modal
				isOpen={isOpen}
				onRequestClose={closeModal}
				style={customStyles}
				contentLabel="Change Password Modal"
			>
				<h2>Change Password</h2>
				{statusMessage && <div>{statusMessage}</div>}
				<form onSubmit={handlePasswordChange}>
					<div>
						<label htmlFor="password">New Password:</label>
						<input type="password" name="password" value={password} onChange={handleChange} />
					</div>
					<div>
						<label htmlFor="confirmPassword">Confirm New Password:</label>
						<input type="password" name="confirmPassword" value={confirmPassword} onChange={handleChange}/>
					</div>
					<button onClick={closeModal}>Cancel</button>
					<button type="submit">Submit</button>
				</form>
			</Modal>
		</div>
	);

};

export default PrivateProfileSection;