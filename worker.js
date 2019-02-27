var mongoose = require('mongoose');
var config = require('./config/app_' + process.env.NODE_ENV);
var url = require("./models/url");
var indexer = require('./modules/indexer');
mongoose.connect(config.database, {useNewUrlParser: true});
var CronJob = require('cron').CronJob;

console.log('Starting indexer service...');
new CronJob('*/5 * * * * *', function() {
  var urls = url.find({ 'status': 'idle' });
  urls.exec(function (err, urls) {
    if (err) return handleError(err);
    urls.forEach(function(url, index, arr){
      console.log('Notifying url: ' + url.location);

      var initializeIndexer = indexer.notify(url.location);
      initializeIndexer.then(function(result) {
        urlDetails = result;
        url.response_status_code = '200';
        url.response_status_message = urlDetails.urlNotificationMetadata.latestUpdate.type;
        url.notifytime = urlDetails.urlNotificationMetadata.latestUpdate.notifyTime;
        url.status = 'updated';

        url.save(function (err) {
          if (err) return handleError(err);
        });

      }, function(err) {
        console.log(err);
      });

    });
  });
}, null, true, 'Europe/Rome');
