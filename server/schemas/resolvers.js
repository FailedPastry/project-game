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
		me: async (parent, { userId }) => {
			return await User.findById(userId).populate('scores');
		},
		user: async (parent, { userId }) => {
			return await User.findById(userId).populate('scores');
		},
		userScores: async (parent, { userId }) => {
			return await Score.find({ userId: userId }).sort({ score: -1 });
		}
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
			const user = await User.findById(userId);

			if (!user) {
				throw new Error('Cannot find user with this id!');
			}

			await Score.deleteMany({ username: user.username });

			const deletedUser = await User.findByIdAndDelete(userId);

			return deletedUser;
		},

		addScore: async (parent, { userId, score }) => {

			const user = await User.findById(userId);

			if (!user) {
				throw new Error('Cannot find user with this id!');
			}

			const newScore = await Score.create({ score, username: user.username, userId: userId });

			const updatedUser = await User.findByIdAndUpdate(
				userId,
				{ $push: { scores: newScore._id } },
				{ new: true }
			).populate('scores');

			return updatedUser;
		},

		deleteScore: async (parent, { scoreId }) => {
			const score = await Score.findOneAndDelete({ _id: scoreId });
			return score;
		}
	}
  };
  
  module.exports = resolvers;