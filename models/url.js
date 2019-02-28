var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UrlSchema = new Schema({
  location: { type: String },
  type: { type: String },
  response_status_code: { type: String },
  response_status_message: { type: String },
  notifytime: { type: Date },
  status: { type: String },
  updatedat: { type: Date }
});

module.exports = mongoose.model('Url', UrlSchema);
