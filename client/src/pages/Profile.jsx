import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ME, GET_USER_SCORES } from '../utils/queries';
import Auth from '../utils/auth';

const Profile = () => {

	const profile = Auth.getProfile();
	console.log(profile);

	const { loading: loadingMe, data: dataMe, error: errorMe } = useQuery(GET_ME, {
		variables: { userId: Auth.getProfile().data._id },
	});

	const { loading: loadingScores, data: dataScores, error: errorScores } = useQuery(GET_USER_SCORES, { variables: { userId: Auth.getProfile().data._id } });

	console.log(dataScores);

	if (loadingMe || loadingScores) {
		return <div>Loading...</div>
	}

	if (errorMe || errorScores) {
		return <div>Error</div>
	}

	if (!dataMe || !dataScores) {
		return <div>No data</div>
	}

	// if (dataScores)

	return (
		<div className="profile">
			<h2>Profile</h2>
			<div className='avatar'>
				<img src="/img/profile.png" alt='avatar' />
				<h2>{dataMe?.me?.username || "username"}</h2>
			</div>
			<div className="favGame">

			</div>
			<div className="highScores">
				<div className="highScore1">
					{dataScores?.userScores[0]?.score || 0}
				</div>
				<div className="highScore2">
					{dataScores?.userScores[1]?.score || 0}
				</div>
				<div className="highScore3">
					{dataScores?.userScores[2]?.score || 0}
				</div>
			</div>
			<div className="bio">
			
			</div>
			<div className="links">
				
			</div>
		</div>
	);
}

export default Profile;