import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import Modal from 'react-modal';
import Auth from '../utils/auth';
import { GET_SINGLE_USER } from '../utils/queries';

const PrivateProfileSection = ({ user }) => {

	const [isOpen, setIsOpen] = React.useState(false);

	const myProfile = Auth.getProfile();


	const { loading, data } = useQuery(GET_SINGLE_USER, {
		variables: { userId: myProfile.data._id }
	});

	const customStyles = {
		content: {
		  top: '50%',
		  left: '50%',
		  right: 'auto',
		  bottom: 'auto',
		  marginRight: '-50%',
		  transform: 'translate(-50%, -50%)',
		},
	  };

	Modal.setAppElement('#root');

	const openModal = () => {
		setIsOpen(true);
	}

	const closeModal = () => {
		setIsOpen(false);
	}

	

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
				<button className="profile_btn">New Game</button>
				<button className="profile_btn">Edit Game</button>
				<button className="profile_btn">Delete Game</button>
			</div>
			<div className="profile_btns">
				<button onClick={openModal} className="profile_btn">Change Password</button>
				<button className="profile_btn">Delete Account</button>
			</div>
		</div>
	);

};

export default PrivateProfileSection;