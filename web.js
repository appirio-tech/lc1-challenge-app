(function (undefined) {
  'use strict';

  var express = require("express");
  var logfmt = require("logfmt");
  var url = require('url');
  var app = express();

  var fileOptions = {
    root: __dirname
  };

  //middleware
  app.use(logfmt.requestLogger());

  app.use('/edit', express.static(__dirname + '/client/edit-challenge'));
  app.use('/manage', express.static(__dirname + '/client/manage-challenge'));
  app.use('/*/bower_components', express.static(__dirname + '/client/bower_components'));
  app.use('/*/aaf', express.static(__dirname + '/client/aaf'));
  app.use('/*/challenge', express.static(__dirname + '/client/challenge'));

  //server side routes
  //challenge management
  app.get('/manage', function (req, res) {
    res.sendFile('client/manage-challenge/index.html', fileOptions, handleFileError);
  });

  //create/edit challenge
  app.get('/edit', function (req, res) {
    res.sendFile('client/edit-challenge/public-info.html', fileOptions, handleFileError);
  });

<<<<<<< HEAD
  // routes for mock API controllers
  var bodyParser = require('body-parser');
  app.use(bodyParser.json());
  
  var challenges = require('./routes/challenges');
  var tags = require('./routes/tags');
  var accounts = require('./routes/accounts');
  app.use('/challenges', challenges);
  app.use('/tags', tags);
  app.use('/accounts', accounts);

=======
  //default direct to manage page
  app.get('/', function (req, res) {
    res.redirect('/manage');
  });
>>>>>>> upstream/master

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