const { User } = require('../models');

const resolvers = {
	Query: {
		allUsers: async () => {
			return await User.find();
		},
	},
  };
  
  module.exports = resolvers;