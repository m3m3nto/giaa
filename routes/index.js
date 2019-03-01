let mongoose = require('mongoose');
let config = require('../config/app_' + process.env.NODE_ENV);
let express = require('express');
let Url = require("../models/url");
let indexer = require('../modules/indexer');
let checker = require('../modules/checker');
let utils = require('../modules/utils');
let router = express.Router();

router.get('/', function(req, res, next) {
  res.redirect('/1');
});

router.get('/:page', function(req, res, next) {
  var perPage = 20;
  if(req.params.page == 0){
    res.redirect('/1');
  }
  var page = req.params.page || 1;

  var urls = Url.find().skip((perPage * page) - perPage).limit(perPage).sort({ id: -1 });
  urls.exec(function (err, urls) {
    if (err) return handleError(err);

    utils.remainingUrls(function(err, count){
      var count = config.api_daily_quota - count;
      Url.countDocuments().exec(function(err, pagecount) {
        if (err) return next(err)
        res.render('index', {
            title: 'Giaa: Google Indexing API Automator',
            urls: urls,
            quota: count,
            current: page,
            pages: Math.ceil(pagecount / perPage)
        })
      })
    });

  });
});

router.post('/', function(req, res, next) {
  locations = req.body.url.split('\n').filter(Boolean);
  locations.forEach(function(loc, index, arr){
    loc = loc.replace(/\r?\n|\r/g, "");

    if(checker.valid_url(loc, req.body.type)){
      var initializeChecker = checker.http_check(loc, req.body.type);
      initializeChecker.then(function(result) {
        //res.io.emit('updateUrl', result);
      }, function(err) {
        res.io.emit('updateUrl', err);
      });
    }

  });

  res.redirect('/1');
});

router.get('/config', function(req, res, next) {
  res.render('config', {
      title: 'Giaa Configuration'
  })
});

module.exports = router;
