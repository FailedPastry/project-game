const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://njmeister99:26IhfrEiWRzmTDyq@cluster0.sybd48r.mongodb.net/game-invaders?retryWrites=true&w=majority&appName=Cluster0" || 'mongodb://127.0.0.1:27017/game_invaders');

module.exports = mongoose.connection;
