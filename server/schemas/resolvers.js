const { User, Score } = require('../models');

const resolvers = {
	Query: {
		allUsers: async () => {
			return await User.find().populate('scores');
		},
		allScores: async () => {
			return await Score.find();
		},
	},
  };
  
  module.exports = resolvers;