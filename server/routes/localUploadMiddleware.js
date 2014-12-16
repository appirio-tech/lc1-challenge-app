/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 file from master
 */
'use strict';

var _ = require('lodash');
var fse = require('fs-extra');
var multiparty = require('multiparty');
var routeHelper = require('./routeHelper');
var uploadDirectory;

var checkOptions = function(options) {
  // check options for local storage configuration
  if(!options.uploadsDirectory) {
    return new Error('uploadsDirectory configuration is needed for local storage');
  }
};

module.exports = function(options, config) {
  var err = checkOptions(options);
  if(err) {
    throw err;
  }
  uploadDirectory = config.root + '/' + options.uploadsDirectory;
  var provider = {};

  provider.handleUpload = function(req, res, next) {

    var form = new multiparty.Form({uploadDir: config.root + '/' + options.tempDir});

    // parsing form:
    // use callback version to collect fields and files together than event handler.
    // it's hard to sync with event handler.
    form.parse(req, function(err, fields, files) {
      if (err) {
        routeHelper.addError(req, err);
        next();
      } else {
        var file = {};
        // add field parameters
        Object.keys(fields).forEach(function(name) {
          file[name] = fields[name][0];

        });

        var receivedFile = files.file[0];  // assume only one file
        var fileName = receivedFile.originalFilename;
        var targetDirectory = uploadDirectory + '/' + 'challenges' + '/' + req.params.challengeId;
        var targetPath = targetDirectory + '/' + fileName;

        _.extend(file, {
          filePath : targetPath,
          fileName : fileName,
          size : receivedFile.size,
          // storageLocation configured in config. same as name of storage provider
          // challenge service is using storageLocation so chaned storageType to storage location
          storageLocation : config.uploads.storageProvider
        });

        // move file, overwrite if exists
        fse.move(receivedFile.path, targetPath, {clobber: true}, function(err) {
          if(err) {
            console.log('Error moving file [ ' + targetPath + ' ] ' + JSON.stringify(err));
            routeHelper.addError(req, err);
            next();
          } else {
            // save file data to req.body and pass it to next handler
            req.body = file;
            next();
          }
        });

      }
      
    });
  };
  return provider;
};
