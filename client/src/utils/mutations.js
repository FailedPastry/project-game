import { gql } from '@apollo/client';

export const ADD_USER = gql`
mutation Mutation($username: String!, $email: String!, $password: String!) {
	addUser(username: $username, email: $email, password: $password) {
	  token
	  user {
		_id
		username
		email
	  }
	}
  }
`;

export const LOGIN_USER = gql`
  mutation Mutation($email: String!, $password: String!) {
	login(email: $email, password: $password) {
	  token
	  user {
		username
	  }
	}
  }
`;

export const UPDATE_USER = gql`
  mutation Mutation($userId: ID!, $username: String!, $email: String!, $password: String!) {
	updateUser(userId: $userId, username: $username, email: $email, password: $password) {
	  username
	  email
	}
  }
`;

export const DELETE_USER = gql`
  mutation Mutation($userId: ID!) {
	deleteUser(userId: $userId) {
	  username
	}
  }
`;

export const ADD_SCORE = gql`
  mutation Mutation($userId: ID!, $score: Int!) {
	addScore(userId: $userId, score: $score) {
	  username
	  scores {
		score
	  }
	}
  }
`;

export const DELETE_SCORE = gql`
  mutation Mutation($scoreId: ID!) {
	deleteScore(scoreId: $scoreId) {
	  score
	  _id
	}
  }
`;

export const ADD_GAME = gql`
  mutation AddGame($title: String!, $bannerImg: String, $devs: [ID!]!) {
    addGame(title: $title, bannerImg: $bannerImg, devs: $devs) {
      _id
      title
      bannerImg
      devs {
        _id
        username
      }
    }
  }
`;

export const UPDATE_GAME = gql`
  mutation UpdateGame($gameId: ID!, $title: String!, $bannerImg: String, $devs: [ID!]!) {
	updateGame(gameId: $gameId, title: $title, bannerImg: $bannerImg, devs: $devs) {
	  _id
	  title
	  bannerImg
	  devs {
		_id
		username
	  }
	}
  }
`;
