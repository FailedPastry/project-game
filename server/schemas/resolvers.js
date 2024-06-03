const { User, Score } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
	Query: {
		allUsers: async () => {
			return await User.find().populate('scores');
		},
		allScores: async () => {
			return await Score.find();
		},
	},

	Mutation: {
		addUser: async (parent, { username, email, password}) => {
			const user = await User.create({ username, email, password });
			const token = signToken(user);
			return { token, user };
		},
		
		login: async (parent, { email, password })=> {
			console.log('email: ', email, 'password: ', password);

			const user = await User.findOne({ email });

			if (!user) {
				throw AuthenticationError();
			}

			const correctPw = await user.isCorrectPassword(password);

			if (!correctPw) {
				throw AuthenticationError();
			}

			const token = signToken(user);
			return { token, user };
		},

		updateUser: async (parent, { userId, username, email, password }) => {
			const user = await User.findByIdAndUpdate(
				userId,
				{ $set: { username: username, email: email, password: password } },
				{ new: true }
			);
			return user;
		},

		deleteUser: async (parent, { userId }) => {
			const user = await User.findOneAndDelete({ _id: userId });
			return user;
		}
	}
  };
  
  module.exports = resolvers;