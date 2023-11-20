let http = require('http');
let request = require('request');
let mongoose = require('mongoose');
let Url = require("../models/url");
let Account = require("../models/account");
let validator = require('validator');
var parse = require('url-parse');

module.exports.valid_url = function valid_url(loc, type){
  return new Promise(function(resolve, reject) {
    var notifyUrl = new Url({
      location: loc,
      type: type,
      response_status_code: '',
      response_status_message: '',
      notifytime: null,
      status: 'error',
      updatedat: new Date()
    });

    var purl = parse(loc, true);
    account = Account.findOne({ domain: {$regex: purl.hostname , $options: 'i'} }).exec(function (err, account) {
      if(account){
        resolve(account.cif);
      }else{
        notifyUrl.response_status_message = 'GSC url property not found';
        notifyUrl.save(function (err) {
          reject(notifyUrl);
          if (err) return handleError(err);
        });
      }
    });
  });
}

module.exports.http_check = function http_check(loc, type) {
  return new Promise(function(resolve, reject) {
    let options = {
      url: loc,
      method: "HEAD",
      followRedirect: false,
      headers: {
        'User-Agent': 'GIAA'
      }
    }
    request(options, function (error, response, body) {
      var notifyUrl = new Url({
        location: loc,
        type: type,
        response_status_code: '',
        response_status_message: '',
        notifytime: '',
        status: '',
        updatedat: new Date()
      });

      if(error || typeof response == 'undefined'){
        notifyUrl.response_status_code = error.code;
        notifyUrl.status = 'error';
        notifyUrl.save(function (err) {
          reject(notifyUrl);
          if (err) return handleError(err);
        });
      }else{
        if(response.statusCode == 200 && type == 'URL_UPDATED'){
          notifyUrl.status = 'pending';
        }else if(response.statusCode == 200 && type == 'URL_DELETED'){
          notifyUrl.response_status_code = response.statusCode;
          notifyUrl.response_status_message = 'Requested URL_DELETED but url returns 200';
          notifyUrl.status = 'error';
        }else if((response.statusCode == 404 || response.statusCode == 410) && type == 'URL_DELETED'){
          notifyUrl.status = 'pending';
        }else if((response.statusCode == 404 || response.statusCode == 410) && type == 'URL_UPDATED'){
          notifyUrl.response_status_code = response.statusCode;
          notifyUrl.response_status_message = 'Requested URL_UPDATED but url returns 404/410';
          notifyUrl.status = 'error';
        }else if(response.statusCode == 301 || response.statusCode == 302 || response.statusCode == 307){
          notifyUrl.location = response.headers.location;
          notifyUrl.status = 'pending';
        }else{
          notifyUrl.response_status_code = response.statusCode,
          notifyUrl.status = 'error';
        }

        notifyUrl.save(function (err) {
          resolve(notifyUrl);
          if (err) return handleError(err);
        });
      }

    });

  });
}
