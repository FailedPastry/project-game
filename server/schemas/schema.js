const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    token: String
  }

  type Score {
    id: ID!
    user: User!
    score: Int!
    createdAt: String!
  }

  type Query {
    getUser(id: ID!): User
    getScores: [Score]
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): User
    login(email: String!, password: String!): User
    submitScore(score: Int!): Score
  }
`;

const resolvers = {
  Query: {
    getUser: async (_, { id }) => User.findById(id),
    getScores: async () => Score.find().sort({ score: -1 }).limit(10),
  },
  Mutation: {
    register: async (_, { username, email, password }) => {
      const user = new User({ username, email, password });
      await user.save();
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
      user.token = token;
      return user;
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user || user.password !== password) {
        throw new Error('Invalid credentials');
      }
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
      user.token = token;
      return user;
    },
    submitScore: async (_, { score }, { user }) => {
      if (!user) throw new Error('Authentication required');
      const newScore = new Score({ user: user._id, score });
      await newScore.save();
      return newScore;
    }
  }
};

module.exports = { typeDefs, resolvers };