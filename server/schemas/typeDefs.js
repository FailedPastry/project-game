const { gql } = require('apollo-server-express');

const typeDefs = gql`
  # Define a type for your data

  # Set up an Auth type to handle returning data from a profile creating or user login
  type Auth {
    token: ID!
    user: User!
  }


  type User {
	_id: ID!
	username: String!
	email: String!
	scores: [Score]
	favGame: Game
	games: [Game]
  }

  type Score {
	_id: ID!
	score: Int!
	user: User
	game: Game
  }

  type Game {
	_id: ID!
	title: String!
	bannerImg: String
	devs: [User]
   }

  type Query {
	allUsers: [User]
	allScores: [Score]
	allGames: [Game]
	singleGame(gameId: ID!): Game
	me(userId: ID!): User
	user(userId: ID!): User
	userScores(userId: ID!): [Score]


  }

  type Mutation {
	addUser(username: String!, email: String!, password: String!): Auth
	login(email: String!, password: String!): Auth
	updateUser(userId: ID!, username: String!, email: String!, password: String!): User
	deleteUser(userId: ID!): User
	addScore(userId: ID!, score: Int!, gameId: ID!): Score
	deleteScore(scoreId: ID!): Score
	addGame(title: String!, bannerImg: String, devs: [ID!]): Game
	deleteGame(gameId: ID!): Game
	updateGame(gameId: ID!, title: String!, bannerImg: String, devs: [ID!]): Game
	


  }
`;

module.exports = typeDefs;