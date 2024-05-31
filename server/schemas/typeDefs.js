const { gql } = require('apollo-server-express');

const typeDefs = gql`
  # Define a type for your data
  type User {
	_id: ID
	username: String
	email: String
  }

  type Query {
	allUsers: [User]
  }
`;

module.exports = typeDefs;