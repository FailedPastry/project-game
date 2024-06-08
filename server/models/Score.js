const { Schema, model } = require('mongoose');

const scoreSchema = new Schema(
 {
	score: {
	  type: Number,
	  required: true,
	},
	user: {
	  type: Schema.Types.ObjectId,
	  ref: 'User',
	  required: true,
	},
	game: {
	  type: Schema.Types.ObjectId,
	  ref: 'Game',
	  required: true,
	},
  },
);

const Score = model('Score', scoreSchema);

module.exports = Score;