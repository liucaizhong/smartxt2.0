var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cons = require('consolidate');
var session = require('express-session');

// routes 
var index = require('./routes/index');
var signup = require('./routes/signup');
var login = require('./routes/login');
var pricing = require('./routes/pricing');
var explore = require('./routes/explore');
var news = require('./routes/news');
var research = require('./routes/research');
var user = require('./routes/user');
//solve cross client problem
//for the purpose of development
var cross = require('./routes/cross');

var app = express();

// view engine setup
app.engine('html', cons.mustache);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// app.use(favicon(path.join(__dirname, 'build/img/icon', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'build')));

// add session
app.use(session({
  secret: 'smartxt2.0 is online',
  resave: false,
  saveUninitialized: false
}));

// define the relation url&js
app.use('/index', index);
app.use('/signup', signup);
app.use('/login', login);
app.use('/pricing', pricing);
app.use('/explore', explore);
app.use('/news', news);
app.use('/research', research);
app.use('/user', user);
//solve cross client problem
//for the purpose of development
app.get('/cross', function(req, res) {
  cross.get(req, res);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('404');
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('404');
});


module.exports = app;
