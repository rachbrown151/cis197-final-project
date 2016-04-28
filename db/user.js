var mongo = require('./mongo');

module.exports = {
  getAllUsers: function (callback) {
    mongo.User.find(function (error, users) {
      callback(error, users);
    });
  },

  getUserByUserName: function (username, callback) {
    mongo.User.find({username: username}).exec(function (error, user) {
      callback(error, user);
    });
  },

  createUser: function (userData, callback) {
    var user = new mongo.User(userData);
    user.save(function (error) {
      callback(error);
    });
  },

  updateFriend: function (user, friends, callback) {
    mongo.User.update(user, {friends: friends}, {}, function (error) {
      callback(error);
   });
  },

  updateSong: function (user, songs, callback) {
    mongo.User.update(user, {songs: songs}, {}, function (error) {
      callback(error);
   });
  }

};
