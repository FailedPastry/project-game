const db = require('../config/connection');

const { User, Score } = require('../models');

const userSeed = [
  {
    username: 'testuser1',
    email: 'testuser1@test.com',
    password: 'password123'
  },
  {
    username: 'user23',
    email: 'userguy@email.com',
    password: 'password123'
  },
  {
    username: 'tperson',
    email: 'person@test.com',
    password: 'password123'
  },
  {
    username: 'george',
    email: 'jtgeorge@email.com',
    password: 'password123'
  },
];

const scoreSeed = [
  {
    score: 100,
    username: 'testuser1'
  },
  {
    score: 1,
    username: 'george'
  },
  {
    score: 110,
    username: 'tperson'
  },
  {
    score: 500,
    username: 'user23'
  },
  {
    score: 100,
    username: 'user23'
  },
  {
    score: 140,
    username: 'testuser1'
  },
  {
    score: 135,
    username: 'tperson'
  },
  {
    score: 2,
    username: 'george'
  },
  {
    score: 10,
    username: 'george'
  },
];

db.once('open', async () => {
  try {
    await User.deleteMany({});
	await Score.deleteMany({});
   

    const users =  await User.create(userSeed);
    const scores = await Score.create(scoreSeed);

	for (let user of users) {
		const userScores = scores.filter(score => score.username === user.username);
		await User.findByIdAndUpdate(user._id, { scores: userScores.map(score => score._id) });
	}


    console.log('all done!');
    process.exit(0);
  } catch (err) {
    throw err;
  }
});