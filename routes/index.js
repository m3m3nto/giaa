var mongoose = require('mongoose');
var config = require('../config/app_' + process.env.NODE_ENV);
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Giaa: Google Indexing API Automator',
  });
});

module.exports = router;
