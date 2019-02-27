var mongoose = require('mongoose');
var config = require('../config/app_' + process.env.NODE_ENV);
var express = require('express');
var Url = require("../models/url");
var indexer = require('../modules/indexer');
var router = express.Router();

router.get('/', function(req, res, next) {
  var urls = Url.find().sort({ response_status_code: 1, notifytime: -1 });
  urls.exec(function (err, urls) {
    if (err) return handleError(err);

    var dateFrom = new Date();
    dateFrom.setUTCHours(0,0,1,0);

    Url.countDocuments({'notifytime' : { $gt : dateFrom}, 'status': 'updated'}, function( err, count){
      res.render('index', {
        title: 'Giaa: Google Indexing API Automator',
        urls: urls,
        quota: (config.api_daily_quota - count)
      });
    });
  });
});

router.post('/', function(req, res, next) {
  locations = req.body.url.split('\n').filter(Boolean);
  console.log(locations);

  locations.forEach(function(loc, index, arr){
    loc.replace(/(\r\n|\n|\r)/gm, "");
    var notifyUrl = new Url({
      location: loc,
      type: req.body.type,
      response_status_code: '',
      response_status_message: '',
      notifytime: null,
      status: 'idle'
    });

    notifyUrl.save(function (err) {
      if (err) return handleError(err);
    });
  });

  res.redirect('/');
});

module.exports = router;
