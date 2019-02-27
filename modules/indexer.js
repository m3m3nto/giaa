let request = require("request");
let {google} = require("googleapis");
let key = require("../config/cids/indexing-230911-29c9139c99ff.json");

module.exports.notify = function notify(url, type) {
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
          "type": type
        },
      }

      request(options, function (error, response, body) {
        if(error){
          reject(body);
        }
        resolve(body);
      });
    });

  });
}
