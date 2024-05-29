const { gql } = require('apollo-server-express');

const typeDefs = gql`
  # Define a type for your data
  type Item {
    id: ID!
    name: String!
    description: String
    price: Float!
  }

  # Define the input type for creating and updating items
  input ItemInput {
    name: String!
    description: String
    price: Float!
  }

  # Define the queries that can be performed
  type Query {
    allItems: [Item]
    item(id: ID!): Item
  }

  # Define the mutations that can be performed
  type Mutation {
    createItem(input: ItemInput!): Item
    updateItem(id: ID!, input: ItemInput!): Item
    deleteItem(id: ID!): Item
  }
`;

module.exports = typeDefs;