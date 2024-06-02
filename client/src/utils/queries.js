import { gql } from '@apollo/client';

export const GET_ME = gql`
	query me ($userId: ID!) {
		me(userId: $userId) {
			_id
			username
			email
			scores {
				_id
				score
			}
		}
	}
`;

export const GET_SINGLE_USER = gql`
	query user ($userId: ID!) {
		user(userId: $userId) {
			_id
			username
			email
			scores {
				_id
				score
			}
		}
	}
`;

export const GET_USER_SCORES = gql`
	query userScores ($userId: ID!) {
		userScores(userId: $userId) {
			_id
			score
			username
			userId
		}
	}
`;