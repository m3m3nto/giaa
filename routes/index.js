let mongoose = require('mongoose');
let config = require('../config/app.js');
let express = require('express');
let Url = require("../models/url");
let Account = require("../models/account");
let indexer = require('../modules/indexer');
let checker = require('../modules/checker');
let utils = require('../modules/utils');
let parse = require('url-parse');
let multer = require('multer');
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'tmp/')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now())
    }
});
let upload = multer({storage: storage});
let fs = require('fs');
let readline = require('readline');
let router = express.Router();
mongoose.set('useCreateIndex', true);

router.get('/', function(req, res, next) {
  res.redirect('/request/1');
});

router.get('/request/:page', function(req, res, next) {
  var dir = './tmp/';
  if (!fs.existsSync(dir)){ fs.mkdirSync(dir); }

  var perPage = 20;
  if(req.params.page == 0 || isNaN(req.params.page)){
    res.redirect('/request/1');
  }
  var page = req.params.page || 1;

  var urls = Url.find().skip((perPage * page) - perPage).limit(perPage).sort({ id: -1 });
  (typeof req.query.type !== 'undefined' && req.query.type !== '' )? urls.where({ type: req.query.type }) : null;
  (typeof req.query.status !== 'undefined' && req.query.status !== '') ? urls.where({ status: req.query.status }) : null;
  (typeof req.query.code !== 'undefined' && req.query.code !== '') ? urls.where({ response_status_code: { $regex: '^' + req.query.code } }) : null;
  (typeof req.query.domain !== 'undefined' && req.query.domain !== '') ? urls.where({ location: { $regex: '^' + req.query.domain } }) : null;
  urls.exec(function (err, urls) {
    if (err) return handleError(err);

    utils.remainingUrls(function(err, count){
      var count = config.api_daily_quota - count;
      var pagination = Url.countDocuments();

      (typeof req.query.type !== 'undefined' && req.query.type !== '' )? pagination.where({ type: req.query.type }) : null;
      (typeof req.query.status !== 'undefined' && req.query.status !== '') ? pagination.where({ status: req.query.status }) : null;
      (typeof req.query.code !== 'undefined' && req.query.code !== '') ? pagination.where({ response_status_code: { $regex: '^' + req.query.code } }) : null;
      (typeof req.query.domain !== 'undefined' && req.query.domain !== '') ? pagination.where({ location: { $regex: '^' + req.query.domain } }) : null;

      pagination.countDocuments().exec(function(err, pagecount) {
        if (err) return next(err);
        res.render('index', {
            title: 'Giaa: Google Indexing API Automator',
            urls: urls,
            quota: count,
            current: page,
            pages: Math.ceil(pagecount / perPage),
            params: req.query
        })
      })
    });

  });
});

router.post('/request', upload.single('csv-file'), function(req, res, next) {
  if(typeof req.file === 'undefined'){
    locations = req.body.url.split('\n').filter(Boolean);
  }else{
    locations = fs.readFileSync('tmp/' + req.file.filename).toString().split("\n");
  }

  locations.forEach(function(loc, index, arr){
    var loc = loc.replace(/\r?\n|\r/g, "").trim();
    var urlValidator = checker.valid_url(loc, req.body.type)
    urlValidator.then(function(result) {
      if(result){
        var initializeChecker = checker.http_check(loc, req.body.type);
        initializeChecker.then(function(result) {
          res.io.emit('updateUrl', result);
        }, function(err) {
          res.io.emit('updateUrl', err);
        });
      }
    }, function(err) {
      res.io.emit('updateUrl', err);
    });
  });

  res.redirect('/request/1');
});

router.get('/config', function(req, res, next) {
  var dir = './' + config.cids_dir;
  var fs = require('fs');

  var cids = [];
  fs.readdirSync(dir).forEach(function(file, index, arr){
    cids[index] = file;
  });

  var accounts = Account.find();
  accounts.exec(function(err, accounts){
    if (err) return next(err);
    res.render('config', {
      title: 'Giaa Configuration',
      cids: cids,
      accounts: accounts
    })
  });
});

router.post('/config', function(req, res, next) {
  var account = new Account({
    cif: req.body.cif,
    domain: req.body.domain
  });

  account.save(function (err) {
    if (err) return handleError(err);
  });
  res.redirect('/config');
});

router.get('/config/remove', function(req, res, next) {
  Account.deleteOne({ _id: req.query._id }, function (err) {
    if (err) return handleError(err);
    res.redirect('/config');
  });

});

module.exports = router;
