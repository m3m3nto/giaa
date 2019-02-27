var mongoose = require('mongoose');
var config = require('../config/app_' + process.env.NODE_ENV);
var express = require('express');
var indexer = require('../modules/indexer');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Giaa: Google Indexing API Automator',
  });
});

router.post('/', function(req, res, next) {
  var initializeIndexer = indexer.notify(req.body.url);
  initializeIndexer.then(function(result) {
    urlDetails = result;
    console.log(urlDetails);
    console.log(urlDetails.urlNotificationMetadata.latestUpdate.type)
  }, function(err) {
    console.log(err);
  });

  res.render('index', {
    title: 'Giaa: Google Indexing API Automator',
  });

});

module.exports = router;
