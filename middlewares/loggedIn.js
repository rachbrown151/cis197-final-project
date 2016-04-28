var loggedIn = function (req, res, next) {
  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect('/login');
  }
};

// Export the middleware function for use in app.js
module.exports = loggedIn;
