var mongoose = require('mongoose');
var config = require('../config/app_' + process.env.NODE_ENV);
var express = require('express');
var url = require("../models/url");
var indexer = require('../modules/indexer');
var router = express.Router();

router.get('/', function(req, res, next) {
  var urls = url.find().sort({ response_status_code: 1, notifytime: -1 });
  urls.exec(function (err, urls) {
    if (err) return handleError(err);

    res.render('index', {
      title: 'Giaa: Google Indexing API Automator',
      urls: urls
    });
  });
});

router.post('/', function(req, res, next) {

  locations = req.body.url.split('\n').filter(Boolean);
  console.log(locations);

  locations.forEach(function(loc, index, arr){
    loc.replace(/(\r\n|\n|\r)/gm, "");
    var notifyUrl = new url({
      location: loc,
      response_status_code: '',
      response_status_message: '',
      notifytime: '',
      status: 'idle'
    });

    notifyUrl.save(function (err) {
      if (err) return handleError(err);
    });
  });

  res.redirect('/');

});

module.exports = router;
