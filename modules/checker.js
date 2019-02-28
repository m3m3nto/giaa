let http = require('http');
let request = require('request');
let mongoose = require('mongoose');
let Url = require("../models/url");
let validator = require('validator');

module.exports.valid_url = function valid_url(loc, type){
  if(validator.isURL(loc, {
    require_protocol: true
  })){
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
    }
    request(options, function (error, response, body) {
      if(error){
        reject(response.statusCode);
      }

      if(response.statusCode == 200 && type == 'URL_UPDATED'){
        var notifyUrl = new Url({
          location: loc,
          type: type,
          response_status_code: '',
          response_status_message: '',
          notifytime: null,
          status: 'pending',
          updatedat: new Date()
        });
      }else if(response.statusCode == 200 && type == 'URL_REMOVED'){
        var notifyUrl = new Url({
          location: loc,
          type: type,
          response_status_code: '200',
          response_status_message: 'Requested URL_REMOVED but url returns 200',
          notifytime: null,
          status: 'error',
          updatedat: new Date()
        });
      }else if(response.statusCode == 404 && type == 'URL_REMOVED'){
        var notifyUrl = new Url({
          location: loc,
          type: type,
          response_status_code: '',
          response_status_message: '',
          notifytime: null,
          status: 'pending',
          updatedat: new Date()
        });
      }else if(response.statusCode == 404 && type == 'URL_UPDATED'){
        var notifyUrl = new Url({
          location: loc,
          type: type,
          response_status_code: '404',
          response_status_message: 'Requested URL_UPDATED but url returns 404',
          notifytime: null,
          status: 'error',
          updatedat: new Date()
        });
      }else{
        var notifyUrl = new Url({
          location: loc,
          type: type,
          response_status_code: response.statusCode,
          response_status_message: '',
          notifytime: null,
          status: 'error',
          updatedat: new Date()
        });
      }

      notifyUrl.save(function (err) {
        if (err) return handleError(err);
      });

      resolve(response.statusCode);
    });

  });
}
