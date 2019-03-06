var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AccountSchema = new Schema({
  cif: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model('Account', AccountSchema);
