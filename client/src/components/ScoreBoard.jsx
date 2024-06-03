import React from 'react';
import { useQuery } from '@apollo/client';
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
					<div className="rank">{index + 1}</div>
					<div className="game">{score.game.title}</div>
					<div className="username">{score.user.username}</div>
					<div className="score">{score.score}</div>
				</div>
			))}
		</div>
	);
};

export default ScoreBoard;
