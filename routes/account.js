var express = require('express');
var router = express.Router();
var userDb = require('../db/user');

//Renders create account page
router.get('', function (req, res, next) {
  if (req.session.loggedIn) {
    res.redirect('/user/?username=' + req.session.username);
  } else {
    res.render('createAccount');
  }
});

//Creates a new account and redirects user to their profile
router.post('', function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  if (username !== '' && password !== '') {
    userDb.getUserByUserName(username, function(err, user) {
      if (user.length > 0) {
        res.send('Username already exists. Please try another username.');
      } else {
        userDb.createUser({username: username, password: password}, function (err) {
          if (err) {
            next(new Error('database error!'));
          } else {
            req.session.loggedIn = true;
            req.session.username = req.body.username;
            res.redirect('/user/?username=' + req.session.username);
          }
        });
      }
    });
  } else {
    next(new Error('Some fields are undefined.'));
  }
});

module.exports = router;
