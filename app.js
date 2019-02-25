var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
//var morgan = require('morgan');
var mongoose = require('mongoose');
var url = require('url');
var bodyParser = require('body-parser')
var config = require('./config/app_' + process.env.NODE_ENV);

var indexRouter = require('./routes/index');

var async = require('async');
var flash = require('express-flash-2');
//var expressValidator = require('express-validator');
var app = express();

app.locals.env = process.env.NODE_ENV;
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');
//app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
mongoose.connect(config.database, {useNewUrlParser: true});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
   res.locals = {
     env: process.env.NODE_ENV
   };
   next();
});

//app.use(flash());
//app.use(expressValidator());
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
