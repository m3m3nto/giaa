var mongoose = require('mongoose');
var config = require('../config/app_' + process.env.NODE_ENV);
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Giaa: Google Indexing API Automator',
  });
});

router.post('/', function(req, res, next) {

  function initialize(url) {
    let request = require("request");
    let {google} = require("googleapis");
    let key = require("../config/cids/indexing-230911-29c9139c99ff.json");

    return new Promise(function(resolve, reject) {
      const jwtClient = new google.auth.JWT(
        key.client_email,
        null,
        key.private_key,
        ["https://www.googleapis.com/auth/indexing"],
        null
      );

      jwtClient.authorize(function (err, tokens) {

        if (err) {
          console.log(err);
          return;
        }
        let options = {
          url: "https://indexing.googleapis.com/v3/urlNotifications:publish",
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          auth: {
            "bearer": tokens.access_token
          },
          json: {
            "url": url,
            "type": "URL_UPDATED"
          },
        }

        request(options, function (error, response, body) {
          console.log(body);
        });
      });
    });
  }

  var initializePromise = initialize(req.body.url);
  initializePromise.then(function(result) {
    urlDetails = result;
    console.log(urlDetails)
  }, function(err) {
    console.log(err);
  });

  res.render('index', {
    title: 'Giaa: Google Indexing API Automator',
  });

});

module.exports = router;
