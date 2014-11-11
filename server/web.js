(function (undefined) {
  'use strict';

  var express = require("express");
  var logfmt = require("logfmt");
  var url = require('url');
  var config = require("../config/config");

  var app = express();
  var passport = require('passport');
  // tc auth stuff
  var tcAuth = require('./appirio_node_modules/tc-server-auth')(app);

  var fileOptions = {
    root: __dirname + '/../client'
  };

  //NOTE: Order of app.use() matters; first one wins

  //middleware
  app.use(logfmt.requestLogger());
  app.use(passport.initialize());

  app.use('/*/bower_components', express.static(__dirname + '/../client/bower_components'));
  app.use('/edit', express.static(__dirname + '/../client/edit-challenge'));
  app.use('/manage', express.static(__dirname + '/../client/manage-challenge'));
  app.use('/login', express.static(__dirname + '/../client/login'));
  app.use('/bower_components', express.static(__dirname + '/../client/bower_components'));
  app.use('/*/appirio_bower_components', express.static(__dirname + '/../client/appirio_bower_components'));

  //server side routes
  //challenge management
  app.get('/manage', function (req, res) {
    res.sendFile('manage-challenge/index.html', fileOptions, handleFileError);
  });

  //create/edit challenge
  app.get('/edit', function (req, res) {
    res.sendFile('edit-challenge/public-info.html', fileOptions, handleFileError);
  });

  app.get('/login', function (req, res) {
    res.sendFile('login/index.html', fileOptions, handleFileError);
  });

  //default direct to manage page
  app.get('/', function (req, res) {
    res.redirect('/manage');
  });

  // routes for mock API controllers
  var bodyParser = require('body-parser');
  app.use(bodyParser.json());

  var challenges = require('./routes/challenges');
  var tags = require('./routes/tags');
  var accounts = require('./routes/accounts');
  app.use('/challenges', challenges);
  app.use('/tags', tags);
  app.use('/accounts', accounts);

  //server config
  var port = Number(process.env.PORT || 8000);

  app.listen(port, function () {
    console.log("Listening on " + port);
  });

  //helper functions
  function handleFileError(err) {
    if (err) {
      console.log(err);
      console.log("Unable to serve file");
    }
  }
})();
