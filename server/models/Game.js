const { Schema, model } = require('mongoose');

const GameSchema = new Schema(
	  {
	title: {
	  type: String,
	  required: true,
	},
	bannerImg: {
	  type: String,
	  required: false,
	},
	devs: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User',
		}
	],
	path: {
	  type: String,
	  required: true,
	},
  },
);

const Game = model('Game', GameSchema);

module.exports = Game;