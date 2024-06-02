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

	return (
		<div className="profile">
			<h2>Profile</h2>
			<div className='avatar'>
				<img src="" alt='avatar' />
				<h2>{dataMe?.me?.username || "username"}</h2>
			</div>
			<div className="favGame">

			</div>
			<div className="highScores">
				<div className="highScore1">
					{dataScores?.userScores[0].score}
				</div>
				<div className="highScore2">

				</div>
				<div className="highScore3">

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