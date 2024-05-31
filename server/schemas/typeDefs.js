const { gql } = require('apollo-server-express');

const typeDefs = gql`
  # Define a type for your data

  # Set up an Auth type to handle returning data from a profile creating or user login
  type Auth {
    token: ID!
    user: User
  }


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
	addUser(username: String!, email: String!, password: String!): Auth
	login(email: String!, password: String!): Auth
	updateUser(userId: ID!, username: String!, email: String!, password: String!): User
	deleteUser(userId: ID!): User
	addScore(score: Int!, username: String!): Score
	deleteScore(scoreId: ID!): Score
	addFavGame(image: String!): GameBanner
	deleteFavGame(gameId: ID!): GameBanner
	updateFavGame(gameId: ID!, image: String!): GameBanner
	


  }
`;

module.exports = typeDefs;