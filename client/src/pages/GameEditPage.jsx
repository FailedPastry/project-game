import React from 'react';
import { useParams } from 'react-router-dom';
import GameEditForm from '../components/GameEditForm';

const GameEditPage = () => {
	const { gameId } = useParams();

	return (
		<div>
			<GameEditForm gameId={gameId} />
		</div>
	);
}

export default GameEditPage;