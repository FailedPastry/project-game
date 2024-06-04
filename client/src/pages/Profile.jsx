import React from 'react';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';

import { GET_SINGLE_USER } from '../utils/queries';
import Auth from '../utils/auth';
import PrivateProfileSection from '../components/PrivateProfileSection';

const Profile = () => {

	const myProfile = Auth.getProfile();
	console.log("My profile: ");
	console.log(myProfile);

	const { userId } = useParams();
	console.log("User id: " + userId);

	const currentProfile = userId || myProfile.data._id;

	console.log("Current profile: " + currentProfile);

	const { loading, data } = useQuery(GET_SINGLE_USER, {
		variables: { userId: currentProfile }
	});

	if (loading) {
		return <div>Loading...</div>;
	}

	if (!data) {
		return <div>No data</div>;
	}

	console.log(data);

	const sortedScores = data.user.scores.slice().sort((a, b) => b.score - a.score);

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
				<div className="highScore1">
					{sortedScores[0]?.game?.title || "Game"}:
					{sortedScores[0]?.score || 0}
				</div>
				<div className="highScore2">
					{sortedScores[1]?.game?.title || "Game"}:
					{sortedScores[1]?.score || 0}
				</div>
				<div className="highScore3">
					{sortedScores[2]?.game?.title || "Game"}:
					{sortedScores[2]?.score || 0}
				</div>
			</div>
			<div className="bio">
			
			</div>
			<div className="links">
				
			</div>
			{myProfile.data._id === currentProfile && <PrivateProfileSection /> ? 
				<PrivateProfileSection /> : null
			}
		</div>

	);
}

export default Profile;