let mongoose = require('mongoose');
let Url = require("../models/url");

module.exports.remainingUrls = function remainingUrls(callback) {
  var dateFrom = new Date();
  dateFrom.setUTCHours(0,0,1,0);
  Url.countDocuments({'notifytime' : { $gt : dateFrom}, 'status': 'updated'}, function( err, count){
    if (err) {
      callback(err, null);
    } else {
      callback(null, count);
    }
  });
};
