var express = require('express');
var app = express();
var uuid = require('node-uuid');
var accountRouter = require('./routes/account');
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

// Mounting routers

app.use('/createAccount', accountRouter);
app.use('/', loginRouter);
app.use('/song', loggedIn, spotifyRouter);
app.use('/user', loggedIn, userRouter);

// Mounting error-handling middleware.

app.use(handleError);
app.use(pageNotFound);

module.exports = app;
