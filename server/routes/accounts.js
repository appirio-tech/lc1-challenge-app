/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';

var fs = require('fs');
var express = require('express');
var router = express.Router();
var routeHelper = require('./routeHelper');
var controllerHelper = require('./controllerHelper');


// mock account controller
var accountsJson = routeHelper.EDIT_DATA_PATH+'/customerAccounts.json';
var controller = controllerHelper.buildController('Account', null, accountsJson);

// get all data from json file
function _getDataFromJson(jsonfile, callback) {
  fs.readFile(jsonfile, function (err, fileData) {
    if (err) {
      callback(err);
    } else {
      var entities = JSON.parse(fileData);
      callback(null, entities);
    }
  });
}

function getAll(req, res, next){
  _getDataFromJson(accountsJson, function(err, data){
    if(err){
      routeHelper.addError(req, err, 500);
    }else{
      req.data = data;
    }
    next();
  });
}

router.route('/')
  .get(getAll, routeHelper.renderJson)
  .post(controller.create, routeHelper.renderJson);
router.route('/:accountId')
  .get(controller.get, routeHelper.renderJson)
  .put(controller.update, routeHelper.renderJson)
  .delete(controller.delete, routeHelper.renderJson);


module.exports = router;