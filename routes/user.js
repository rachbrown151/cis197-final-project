var express = require('express');
var router = express.Router();
var userDb = require('../db/user');

router.get('', function(req,res) {
  userDb.getUserByUserName(req.query.username, function(err, user) {
    if (user.length > 0) {
      res.render('profile', {user: user[0], username: req.session.username});
    }
    else res.send('No user found with that username.')
  });
});

router.post('/addFriend/:username', function(req,res) {
  shouldFriend = true;
  if (req.params.username === req.session.username) {
    shouldFriend = false;
  }
  userDb.getUserByUserName(req.session.username, function(err, user) {
    for (var i = 0; i < user[0].friends.length; i++) {
      if (user[0].friends[i] === req.params.username) {
        shouldFriend = false;
      }
    }
    if (shouldFriend) {
      friends = user[0].friends;
      friends.push(req.params.username);
      userDb.addFriend({username: req.session.username}, friends, function(err) {
        res.redirect('/user/?username=' + req.session.username);
      });
    } else {
      res.redirect('/user/?username=' + req.session.username);
    }
  });
});

router.post('/likeSong/:id', function(req,res) {
  shouldLike = true;
  userDb.getUserByUserName(req.session.username, function(err, user) {
    for (var i = 0; i < user[0].songs.length; i++) {
      if (user[0].songs[i] === req.params.id) {
        shouldLike = false;
      }
    }
    if (shouldLike) {
      songs = user[0].songs;
      songs.push(req.params.id);
      userDb.addSong({username: req.session.username}, songs, function(err) {
        res.redirect('/user/?username=' + req.session.username);
      });
    } else {
      res.redirect('/user/?username=' + req.session.username);
    }
  });
});

module.exports = router;
