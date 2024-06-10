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
mutation Mutation($userId: ID!, $score: Int!, $gameId: ID!) {
  addScore(userId: $userId, score: $score, gameId: $gameId) {
    score
    user {
      _id
      username
    }
    game {
      _id
      title
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
  mutation AddGame($title: String!, $description: String!, $controlsGuide: String!, $bannerImg: String, $devs: [ID!]!, $path: String!) {
    addGame(title: $title, description: $description, controlsGuide: $controlsGuide, bannerImg: $bannerImg, devs: $devs, path: $path) {
      _id
      title
	  description
	  controlsGuide
      bannerImg
      devs {
        _id
        username
      }
    }
  }
`;

export const UPDATE_GAME = gql`
  mutation UpdateGame($gameId: ID!, $title: String!, $description: String!, $controlsGuide: String!, $bannerImg: String, $devs: [ID!]!) {
	updateGame(gameId: $gameId, title: $title, description: $description, controlsGuide: $controlsGuide, bannerImg: $bannerImg, devs: $devs) {
	  _id
	  title
	  description
	  controlsGuide
	  bannerImg
	  devs {
		_id
		username
	  }
	}
  }
`;

export const DELETE_GAME = gql`
  mutation DeleteGame($gameId: ID!) {
	deleteGame(gameId: $gameId) {
	  _id
	}
  }
`;
