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
	},
	game: {
	  type: Schema.Types.ObjectId,
	  ref: 'Game',
	},
  },
);

const Score = model('Score', scoreSchema);

module.exports = Score;