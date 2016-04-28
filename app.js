var express = require('express');
var app = express();
var uuid = require('node-uuid');
var accountRouter = require('./routes/account');
var apiRouter = require('./routes/api');
var loginRouter = require('./routes/login');
var userRouter = require('./routes/user');
var spotifyRouter = require('./routes/spotify');
var loggedIn = require('./middlewares/loggedIn');
var handleError = require('./middlewares/handleError');
var pageNotFound = require('./middlewares/pageNotFound');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');

// Serve static pages
app.engine('html', require('ejs').__express);
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.render('index');
});

// Generate a random cookie secret for this app
var generateCookieSecret = function () {
  return 'iamasecret' + uuid.v4();
};

app.use(cookieSession({ secret: generateCookieSecret() }));
app.use(bodyParser.urlencoded({ extended: false }));

// Mount your routers. Please use good style here: mount a single router per use() call,
// preceded only by necessary middleware functions.
// DO NOT mount an 'authenticating' middleware function in a separate call to use().
// For instance, the API routes require a valid key, so mount checkValidKey and apiRouter in the same call.

app.use('/', accountRouter);
app.use('/', apiRouter);
app.use('/', loginRouter);
app.use('/song', loggedIn, spotifyRouter);
app.use('/user', loggedIn, userRouter);

// Mount your error-handling middleware.
// Please mount each middleware function with a separate use() call.

app.use(handleError);
app.use(pageNotFound);

module.exports = app;
