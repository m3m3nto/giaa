let mongoose = require('mongoose');
let config = require('../config/app_' + process.env.NODE_ENV);
let express = require('express');
let Url = require("../models/url");
let indexer = require('../modules/indexer');
let checker = require('../modules/checker');
let utils = require('../modules/utils');
let router = express.Router();

router.get('/', function(req, res, next) {
  var urls = Url.find().sort({ updatedat: -1 });
  urls.exec(function (err, urls) {
    if (err) return handleError(err);

    utils.remainingUrls(function(err, count){
      var count = config.api_daily_quota - count;
      res.render('index', {
        title: 'Giaa: Google Indexing API Automator',
        urls: urls,
        quota: count
      });
    });

  });
});

router.post('/', function(req, res, next) {
  locations = req.body.url.split('\n').filter(Boolean);
  locations.forEach(function(loc, index, arr){
    loc.replace(/(\r\n|\n|\r)/gm, "");

    var initializeChecker = checker.http_check(loc, req.body.type);
    initializeChecker.then(function(result) {
    }, function(err) {
      console.log(err);
    });

  });

  res.redirect('/');
});

module.exports = router;
