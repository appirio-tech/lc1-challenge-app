/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';

var _ = require('lodash');
var fse = require('fs-extra');
var multiparty = require('multiparty');
var routeHelper = require('./routeHelper');


var uploadDirectory = './upload';

module.exports.handleUpload = function(req, res, next) {

  var form = new multiparty.Form({uploadDir: './upload'});

  // parsing form:
  // use callback version to collect fields and files together than event handler.
  // it's hard to sync with event handler.
  form.parse(req, function(err, fields, files) {
    if (err) {
      routeHelper.addError(req, err);
    } else {
      var file = {};
      // add field parameters
      Object.keys(fields).forEach(function(name) {
        file[name] = fields[name][0];
      });

      var receivedFile = files.files[0];  // assume only one file
      var fileName = receivedFile.originalFilename;
      var targetDirectory = uploadDirectory + '/' + 'challenges' + '/' + req.params.challengeId;
      var targetPath = targetDirectory + '/' + fileName;

      _.extend(file, {
        filePath : targetPath,
        fileName : fileName,
        size : receivedFile.size,
        storageLocation : 'local'     // local by default
      });

      // move file, overwrite if exists
      fse.move(receivedFile.path, targetPath, {clobber: true}, function(err) {
        if(err) {
          console.log('Error moving file [ ' + targetPath + ' ] ' + JSON.stringify(err));
          routeHelper.addError(req, err);
        }
      });

      // send back file data to next handler
      req.data = file;
    }
    next();
  });
  
}