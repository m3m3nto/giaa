var mongoose = require('mongoose');
var config = require('./config/app_' + process.env.NODE_ENV);
var Url = require("./models/url");
var indexer = require('./modules/indexer');
mongoose.connect(config.database, {useNewUrlParser: true});
var CronJob = require('cron').CronJob;

console.log('Starting indexer service...');
new CronJob('*/5 * * * * *', function() {

  function remainingUrls(dateFrom, callback) {
    Url.countDocuments({'notifytime' : { $gt : dateFrom}, 'status': 'updated'}, function( err, count){
      if (err) {
        callback(err, null);
      } else {
        callback(null, config.api_daily_quota - count);
      }
    });
  };

  var dateFrom = new Date();
  dateFrom.setUTCHours(0,0,1,0);
  remainingUrls(dateFrom, function(err, remainingUrls) {
    if(err){
      console.log(err);
    }

    if(remainingUrls > 0){
      var urls = Url.find({ 'status': 'idle' }).limit(remainingUrls);
      urls.exec(function (err, urls) {
        if (err) return handleError(err);
        urls.forEach(function(url, index, arr){
          console.log('Notifying url: ' + url.location);

          var initializeIndexer = indexer.notify(url.location, url.type);
          initializeIndexer.then(function(result) {

            urlDetails = result;
            if(urlDetails.error){
              url.response_status_code = urlDetails.error.code;
              url.response_status_message = urlDetails.error.message;
              url.notifytime = new Date();
              url.status = 'updated';
            }else{
              url.response_status_code = '200';
              url.response_status_message = urlDetails.urlNotificationMetadata.latestUpdate.type;
              url.notifytime = urlDetails.urlNotificationMetadata.latestUpdate.notifyTime;
              url.status = 'updated';
            }

            url.save(function (err) {
              if (err) return handleError(err);
            });

          }, function(err) {
            console.log(err);
          });

        });
      });
    }else{
      console.log('Exeeding daily quota!');
    }

  });

}, null, true, 'Europe/Rome');
