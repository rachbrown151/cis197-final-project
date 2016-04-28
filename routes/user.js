var express = require('express');
var router = express.Router();
var userDb = require('../db/user');

/* Full path is /user?username=:username
 * Renders profile page for that specific user 
 */
router.get('', function (req,res) {
  userDb.getUserByUserName(req.query.username, function (err, user) {
    if (user.length > 0) {
      res.render('profile', {user: user[0], username: req.session.username});
    } else res.send('No user found with that username.');
  });
});

/* Full path is /user/edit
 * Renders edit profile page for logged in user
 */
router.get('/edit', function (req,res) {
  userDb.getUserByUserName(req.session.username, function (err, user) {
    res.render('edit', {user: user[0]});
  });
});

/* Adds :username as a friend for logged in user if :username is
 * not already a friend of the logged in user (only one way friendship though)
 */
router.post('/addFriend/:username', function (req,res) {
  var shouldFriend = true;
  if (req.params.username === req.session.username) {
    shouldFriend = false;
  }
  userDb.getUserByUserName(req.session.username, function (err, user) {
    for (var i = 0; i < user[0].friends.length; i++) {
      if (user[0].friends[i] === req.params.username) {
        shouldFriend = false;
      }
    }
    if (shouldFriend) {
      var friends = user[0].friends;
      friends.push(req.params.username);
      userDb.updateFriend({username: req.session.username}, friends, function (err) {
        res.redirect('/user/?username=' + req.session.username);
      });
    } else {
      res.redirect('/user/?username=' + req.session.username);
    }
  });
});

// Removes :username as a friend for legged in user
router.post('/removeFriend/:username', function (req,res) {
  var index = -1;
  userDb.getUserByUserName(req.session.username, function (err, user) {
    for (var i = 0; i < user[0].friends.length; i++) {
      if (user[0].friends[i] === req.params.username) {
        index = i;
      }
    }
    if (index !== -1) {
      var friends = user[0].friends;
      friends.splice(index, 1);
      userDb.updateFriend({username: req.session.username}, friends, function (err) {
        res.redirect('/user/edit');
      });
    } else {
      res.redirect('/user/edit');
    }
  });
});

// Adds :id (spotify song id) to user's liked songs
router.post('/likeSong/:id', function (req,res) {
  var shouldLike = true;
  userDb.getUserByUserName(req.session.username, function (err, user) {
    for (var i = 0; i < user[0].songs.length; i++) {
      if (user[0].songs[i] === req.params.id) {
        shouldLike = false;
      }
    }
    if (shouldLike) {
      var songs = user[0].songs;
      songs.push(req.params.id);
      userDb.updateSong({username: req.session.username}, songs, function (err) {
        res.redirect('/user/?username=' + req.session.username);
      });
    } else {
      res.redirect('/user/?username=' + req.session.username);
    }
  });
});

// Removes :id (spotify song id) from user's liked songs
router.post('/dislikeSong/:id', function (req,res) {
  var index = -1;
  userDb.getUserByUserName(req.session.username, function (err, user) {
    for (var i = 0; i < user[0].songs.length; i++) {
      if (user[0].songs[i] === req.params.id) {
        index = i;
      }
    }
    if (index !== -1) {
      var songs = user[0].songs;
      songs.splice(index, 1);
      userDb.updateSong({username: req.session.username}, songs, function (err) {
        res.redirect('/user/edit');
      });
    } else {
      res.redirect('/user/edit');
    }
  });
});

module.exports = router;
