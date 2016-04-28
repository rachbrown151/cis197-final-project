var express = require('express');
var router = express.Router();
var userDb = require('../db/user');

var credentalsAreValid = function (username, password, callback) {
  userDb.getUserByUserName(username, function(err, user) {
    if (user.length === 0) {
      callback(false);
    } else {
      callback(user[0].password === password);
    }
  });
};

router.get('/login', function (req, res, next) {
  res.render('login');
});

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

module.exports = router;
