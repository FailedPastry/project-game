import { gql } from '@apollo/client';

export const GET_ME = gql`
query Query($userId: ID!) {
	me(userId: $userId) {
	  _id
	  email
	  username
	  scores {
		score
		game {
		  title
		}
	  }
	  games {
		title
	  }
	}
  }
`;

export const GET_SINGLE_USER = gql`
	query user ($userId: ID!) {
		user(userId: $userId) {
			_id
			email
			username
			scores {
			  score
			  game {
				title
			  }
			}
			games {
			  title
			}
		}
	}
`;

export const GET_USER_SCORES = gql`
	query UserScores($userId: ID!) {
		userScores(userId: $userId) {
			score
			game {
				title
			}
			_id
		}
	}
`;

export const GET_LEADERBOARD = gql`
	query leaderboard {
		allScores {
			_id
			score
			user {
				username
			}
			game {
				title
			}
		}
	}
`;

export const GET_ALL_GAMES = gql`
	query allGames {
		allGames {
			_id
			title
			bannerImg
		}
	}
`;

export const GET_GAME = gql`
	query singleGame($gameId: ID!) {
		game(gameId: $gameId) {
			_id
			title
			bannerImg
			developers {
				_id
				username
			}
		}
	}
`;


export const GET_USERS_BY_USERNAME = gql`
  query GetDevsByUsername($usernames: [String!]!) {
    users(where: { username_in: $usernames }) {
      id
    }
  }
`;