let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let mongoose = require('mongoose');
let bodyParser = require('body-parser')
let config = require('./config/app_' + process.env.NODE_ENV);
let indexRouter = require('./routes/index');
let account = require("./models/account");
let url = require("./models/url");
let async = require('async');
let flash = require('express-flash-2');
let app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server);

io.sockets.on("connection",function (socket) {
  socket.on("updatedUrl", function (url, callback) {
    io.emit("updateUrl", url);
  });
});

app.locals.env = process.env.NODE_ENV;
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');
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

app.use(function(req, res, next){
  res.io = io;
  next();
});

app.use(indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = { app: app, server: server };
