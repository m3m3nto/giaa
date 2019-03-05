var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AccountSchema = new Schema({
  cif: {
    type: String,
    required: true
  },
  domains: [{
    name: String
  }],
});

module.exports = mongoose.model('Account', AccountSchema);
