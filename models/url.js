var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UrlSchema = new Schema({
  location: { type: String },
  response_status_code: { type: String },
  response_status_message: { type: String },
  notifytime: { type: String },
  status: { type: String }
});

module.exports = mongoose.model('Url', UrlSchema);
