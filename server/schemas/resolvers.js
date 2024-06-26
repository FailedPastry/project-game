const { get } = require('mongoose');
const bcrypt = require('bcrypt');
const { User, Score, Game } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
	Query: {
		allUsers: async () => {
			return await User.find().populate('scores');
		},
		allScores: async () => {
			return await Score.find().sort({ score: -1 }).populate('user').populate('game');
		},
		// me: async (parent, { userId }) => {
		// 	return await User.findById(userId)
		// 	  .populate({
		// 		path: 'scores',
		// 		populate: {
		// 		  path: 'game',
		// 		  model: 'Game'
		// 		}
		// 	  })
		// 	  .populate('games');
		//   },
		user: async (parent, { userId }) => {
			return await User.findById(userId)
			.populate({
			  path: 'scores',
			  populate: {
				path: 'game',
				model: 'Game'
			  }
			})
			.populate('games');;
		},
		userScores: async (parent, { userId }) => {
			return await Score.find({ user: userId }).sort({ score: -1 }).populate('user').populate('game');
		},
		allGames: async () => {
			return await Game.find().populate('devs');
		},
		singleGame: async (parent, { gameId }) => {
			return await Game.findById(gameId).populate('devs');
		},
		getUsersByUsername: async (parent, { username }) => {
			return await User.find({ username: { $in: username } });

		}
	},

	Mutation: {
		addUser: async (parent, { username, email, password }) => {
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
			const saltRounds = 10;
			const hashedPassword = await bcrypt.hash(password, saltRounds);

			const user = await User.findByIdAndUpdate(
				userId,
				{ $set: { username: username, email: email, password: hashedPassword } },
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

		addScore: async (parent, { userId, score, gameId }) => {

			const user = await User.findById(userId);
			const game = await Game.findById(gameId);

			if (!user) {
				throw new Error('Cannot find user with this id!');
			}

			if (!game) {
				throw new Error('Cannot find game with this id!');
			}

			const newScore = await Score.create({ score, user: userId, game: gameId,});

			const updatedUser = await User.findByIdAndUpdate(
				userId,
				{ $push: { scores: newScore._id } },
				{ new: true }
			).populate('scores');

			const populatedScore = await Score.findById(newScore._id).populate('user').populate('game');

			return populatedScore;
		},

		deleteScore: async (parent, { scoreId }) => {
			const score = await Score.findOneAndDelete({ _id: scoreId });
			return score;
		},

		addGame: async (parent, { title, description, controlsGuide, bannerImg, devs, path }) => {
			const devUsers = await User.find({ _id: { $in: devs } });
			const newGame = await Game.create({ title, description, controlsGuide, bannerImg, devs: devUsers.map(user => user._id), path});

			// Update the games field in the User documents
			for (let userId of devs) {
				const updatedUser = await User.findByIdAndUpdate(
					userId,
					{ $push: { games: newGame._id } },
					{ new: true }
				);
			}
		  
			// Populate the devs field with user data before returning the game
			const populatedGame = await Game.findById(newGame._id).populate('devs').exec();
		  
			return populatedGame;
		},

		deleteGame: async (parent, { gameId }) => {
			await Score.deleteMany({ game: gameId });
			const game = await Game.findByIdAndDelete(gameId);
			return game;
		},

		updateGame: async (parent, { gameId, title, description, controlsGuide, bannerImg, devs, path }) => {
			const devUsers = await User.find({ _id: { $in: devs } });
			const updatedGame = await Game.findByIdAndUpdate (
				gameId,
				{ $set: { title, description, controlsGuide, bannerImg, devs: devUsers.map(user => user._id), path } },
				{ new: true }
			).populate('devs');
			return updatedGame;
		},
	}
  };
  
  module.exports = resolvers;