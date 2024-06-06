import { useQuery } from '@apollo/client';
import { GET_ALL_GAMES } from '../utils/queries';

const Games = () => {

	const { loading, data, error } = useQuery(GET_ALL_GAMES);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error</div>;
	}

	if (!data) {
		return <div>No data</div>;
	}



	return (
		<div>
			<h1>Games</h1>
			<div className="games">
				{data.allGames.map(game => (
					<div key={game._id} className="game">
						<img className="banner" src={game.bannerImg} alt={game.title} />
					</div>
				))}
			</div>
		</div>
	);
}

export default Games;