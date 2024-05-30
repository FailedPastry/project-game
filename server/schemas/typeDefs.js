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

  type Query {
	allUsers: [User]
	allScores: [Score]
  }
`;

module.exports = typeDefs;