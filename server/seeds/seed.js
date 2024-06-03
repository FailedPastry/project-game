const { default: mongoose } = require('mongoose');
const db = require('../config/connection');

const { User, Score, Game } = require('../models');

const userId1 = new mongoose.Types.ObjectId();
const userId2 = new mongoose.Types.ObjectId();
const userId3 = new mongoose.Types.ObjectId();
const userId4 = new mongoose.Types.ObjectId();
const userId5 = new mongoose.Types.ObjectId();

const gameId1 = new mongoose.Types.ObjectId();
const gameId2 = new mongoose.Types.ObjectId();
const gameId3 = new mongoose.Types.ObjectId();

const gameSeed = [
	{
		_id: gameId1,
		title: 'Space Invaders',
		bannerImg: 'game1.jpg',
		devs: [userId1, userId2],
	},
	{
		_id: gameId2,
		title: 'Donkey Kong',
		bannerImg: 'game2.jpg',
		devs: [userId3, userId4, userId5],
	},
	{
		_id: gameId3,
		title: 'Frogger',
		bannerImg: 'game3.jpg',
		devs: [userId5, userId1],
	},
];

const userSeed = [
	{
		_id: userId1,
		username: 'testuser1',
		email: 'testuser1@test.com',
		password: 'password123',
	},
	{
		_id: userId2,
		username: 'user23',
		email: 'userguy@email.com',
		password: 'password123',
	},
	{
		_id: userId3,
		username: 'tperson',
		email: 'person@test.com',
		password: 'password123',
	},
	{
		_id: userId4,
		username: 'george',
		email: 'jtgeorge@email.com',
		password: 'password123',
	},
	{
		_id: userId5,
		username: 'BobbyBoy',
		email: 'bobbydaman@bobby.com',
		password: 'password123',
	},
];

const scoreSeed = [
	{
		score: 100,
		user: userId1,
		game: gameId1,
	},
	{
		score: 200,
		user: userId2,
		game: gameId1,
	},
	{
		score: 1,
		user: userId4,
		game: gameId2,
	},
	{
		score: 110,
		user: userId5,
		game: gameId3,
	},
	{
		score: 500,
		user: userId3,
		game: gameId2,
	},
	{
		score: 330,
		user: userId1,
		game: gameId3,
	},
	{
		score: 100,
		user: userId2,
		game: gameId1,
	},
	{
		score: 140,
		user: userId3,
		game: gameId2,
	},
	{
		score: 135,
		user: userId5,
		game: gameId1,
	},
	{
		score: 2,
		user: userId4,
		game: gameId2,
	},
	{
		score: 10,
		user: userId4,
		game: gameId2,
	},
];

db.once('open', async () => {
	try {
		await User.deleteMany({});
		await Score.deleteMany({});
		await Game.deleteMany({});

		const users = await User.create(userSeed);
		const games = await Game.create(gameSeed);
		const scores = await Score.create(scoreSeed);

		// Update the scores field in the User documents
		for (let score of scores) {
			const user = await User.findById(score.user);
			user.scores.push(score._id);
			await user.save();
		}

		// Update the games field in the User documents
		for (let game of games) {
			for (let userId of game.devs) {
			const user = await User.findById(userId);
			if (user) {
				user.games.push(game._id);
				await user.save();
			}
			}
		}

		console.log('all done!');
		process.exit(0);
	} catch (err) {
		throw err;
	}
});
