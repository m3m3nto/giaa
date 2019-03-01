let http = require('http');
let request = require('request');
let mongoose = require('mongoose');
let Url = require("../models/url");
let validator = require('validator');

module.exports.valid_url = function valid_url(loc, type){
  if(validator.isURL(loc, { require_protocol: true })){
    return true;
  }else{
    var notifyUrl = new Url({
      location: loc,
      type: type,
      response_status_code: '',
      response_status_message: 'Not a valid URI',
      notifytime: null,
      status: 'error',
      updatedat: new Date()
    });

    notifyUrl.save(function (err) {
      if (err) return handleError(err);
    });
    return false;
  }
}

module.exports.http_check = function http_check(loc, type) {
  return new Promise(function(resolve, reject) {
    let options = {
      url: loc,
      method: "HEAD",
      followRedirect: false,
      headers: {
        'User-Agent': 'request'
      }
    }
    request(options, function (error, response, body) {
      var notifyUrl = new Url({
        location: loc,
        type: type,
        response_status_code: '',
        response_status_message: '',
        notifytime: null,
        status: '',
        updatedat: new Date()
      });

      if(error || typeof response == 'undefined'){
        notifyUrl.response_status_code = error.code;
        notifyUrl.status = 'error';
        notifyUrl.save(function (err) {
          if (err) return handleError(err);
        });
        reject(error);
      }else{
        if(response.statusCode == 200 && type == 'URL_UPDATED'){
          notifyUrl.status = 'pending';
        }else if(response.statusCode == 200 && type == 'URL_REMOVED'){
          notifyUrl.response_status_code = response.statusCode;
          notifyUrl.response_status_message = 'Requested URL_REMOVED but url returns 200';
          notifyUrl.status = 'error';
        }else if((response.statusCode == 404 || response.statusCode == 410) && type == 'URL_REMOVED'){
          notifyUrl.status = 'pending';
        }else if((response.statusCode == 404 || response.statusCode == 410) && type == 'URL_UPDATED'){
          notifyUrl.response_status_code = response.statusCode;
          notifyUrl.response_status_message = 'Requested URL_UPDATED but url returns 404';
          notifyUrl.status = 'error';
        }else if(response.statusCode == 301 || response.statusCode == 302){
          notifyUrl.location = response.headers.location;
          notifyUrl.status = 'pending';
        }else{
          notifyUrl.response_status_code = response.statusCode,
          notifyUrl.status = 'error';
        }

        notifyUrl.save(function (err) {
          if (err) return handleError(err);
        });

        resolve(response.statusCode);
      }

    });

  });
}
