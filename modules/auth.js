let config = require('../config/app.js');
let auth = require('basic-auth')

module.exports = function(request, response, next) {
  if(!config.basic_auth) return next();

  var user = auth(request);
  if (!user || config.basic_auth_user !== user.name || config.basic_auth_pass !== user.pass) {
    response.set('WWW-Authenticate', 'Basic realm="example"')
    return response.status(401).send()
  }
  return next();
}
