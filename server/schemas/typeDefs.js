const { gql } = require('apollo-server-express');

const typeDefs = gql`
  # Define a type for your data
  type User {
	_id: ID
	username: String
	email: String
	scores: [Score]
  }

  type Score {
	_id: ID
	score: Int
	username: String
  }

  type GameBanner {
	_id: ID
	image: String
   }

  type Query {
	allUsers: [User]
	allScores: [Score]
  }

  type Mutation {
	addUser(username: String!, email: String!, password: String!): User
	login(email: String!, password: String!): User
	logout: User
	updateUser(username: String, email: String, password: String): User
	deleteUser(userId: ID!): User
	addScore(score: Int!, username: String!): Score
	deleteScore(scoreId: ID!): Score
	addFavGame(image: String!): GameBanner
	deleteFavGame(gameId: ID!): GameBanner
	updateFavGame(gameId: ID!, image: String!): GameBanner
	


  }
`;

module.exports = typeDefs;