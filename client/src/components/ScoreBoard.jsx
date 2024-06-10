import React from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { GET_LEADERBOARD } from '../utils/queries';

const ScoreBoard = () => {
	const { loading, data, error } = useQuery(GET_LEADERBOARD);

	if (loading) {
		return <div>Loading...</div>;
	}
	if (error) {
		return <div>Error</div>;
	}
	if (!data) {
		return <div>No data</div>;
	}

	console.log(data);

	return (
		<div className="leaderboard">
			{data.allScores.map((score, index) => (
				<div key={score._id} className="board_entry">
					<div className="leaderboardRank">{index + 1}</div>
					<div>
						<Link to={`/games/${score.game._id}`} className="leaderboardGame">{score.game.title}</Link>
					</div>
					<div>
						<Link to={`/profile/${score.user._id}`} className="leaderoardUsername">{score.user.username}</Link>
					</div>
					<div className="leaderboardScore">{score.score}</div>
				</div>
			))}
		</div>
	);
};

export default ScoreBoard;
