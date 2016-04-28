var express = require('express');
var router = express.Router();
var userDb = require('../db/user');

router.get('/createAccount', function (req, res, next) {
  res.render('createAccount');
});

router.post('/createAccount', function (req, res, next) {
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
            res.redirect('/user/' + req.session.username);
          }
        });
      }
    });
  } else {
    next(new Error('Some fields are undefined.'));
  }
});

module.exports = router;
