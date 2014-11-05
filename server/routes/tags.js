/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';

var fs = require('fs');
var express = require('express');
var router = express.Router();
var routeHelper = require('./routeHelper');
var controllerHelper = require('./controllerHelper');


// mock tag controller
var tagsJson = routeHelper.EDIT_DATA_PATH+'/tags.json';
var controller = controllerHelper.buildController('Tag', null, tagsJson);

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
  _getDataFromJson(tagsJson, function(err, data){
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
router.route('/:tagId')
  .get(controller.get, routeHelper.renderJson)
  .put(controller.update, routeHelper.renderJson)
  .delete(controller.delete, routeHelper.renderJson);


module.exports = router;
