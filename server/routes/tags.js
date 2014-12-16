/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';

var express = require('express');
var router = express.Router();
var routeHelper = require('./routeHelper');
var controllerHelper = require('./controllerHelper');


// mock tag controller
var tagssJson = routeHelper.EDIT_DATA_PATH+'/tags.json';
var controller = controllerHelper.buildController('Tag', null, tagssJson);

router.route('/')
  .get(controller.all, routeHelper.renderJson)
  .post(controller.create, routeHelper.renderJson);
router.route('/:tagId')
  .get(controller.get, routeHelper.renderJson)
  .put(controller.update, routeHelper.renderJson)
  .delete(controller.delete, routeHelper.renderJson);


module.exports = router;
