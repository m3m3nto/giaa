var mongoose = require('mongoose');
var AutoIncrement = require('mongoose-sequence')(mongoose);
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

UrlSchema.plugin(AutoIncrement, {inc_field: 'id'});
module.exports = mongoose.model('Url', UrlSchema);
