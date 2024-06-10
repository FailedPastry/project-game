const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/game_invaders', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true,
      sslValidate: true,
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

connectDB();

module.exports = mongoose.connection;


//mongodb+srv://njmeister99:26IhfrEiWRzmTDyq@cluster0.sybd48r.mongodb.net/game_invaders?retryWrites=true&w=majority
//mongodb+srv://njmeister99:26IhfrEiWRzmTDyq@cluster0.sybd48r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0