var express = require('express');
var router = express.Router();
var userDb = require('../db/user');

//Checks whether user entered valid username and password
var credentalsAreValid = function (username, password, callback) {
  userDb.getUserByUserName(username, function(err, user) {
    if (user.length === 0) {
      callback(false);
    } else {
      callback(user[0].password === password);
    }
  });
};

//Render login page
router.get('/login', function (req, res, next) {
  res.render('login');
});

//If credentials are valid, logs in user, otherwise redirected to login page
router.post('/login', function (req, res, next) {
  credentalsAreValid(req.body.username, req.body.password, function(valid) {
    if (valid) {
      req.session.loggedIn = true;
      req.session.username = req.body.username;
      res.redirect('/user/?username=' + req.session.username);
    } else {
      res.render('login');
    }
  });
});

//Logs out user from their account
router.get('/logout', function (req, res, next) {
  req.session.loggedIn = false;
  req.session.username = '';
  res.redirect('/login');
});

module.exports = router;
