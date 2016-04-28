var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cis197project', function (err) {
  if (err && err.message.includes('ECONNREFUSED')) {
    console.log('Error connecting to mongodb database: %s.\nIs "mongod" running?', err.message);
    process.exit(0);
  } else if (err) {
    throw err;
  } else {
    console.log('DB successfully connected.');
  }
});

var db = mongoose.connection;

var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  songs: Array,
  friends: Array,
  newsfeed: Array
});

var User = mongoose.model('User', userSchema);

module.exports = {
  User: User,
  mongoose: mongoose,
};
