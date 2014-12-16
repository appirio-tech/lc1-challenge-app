/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';

var express = require('express');
var router = express.Router();
var routeHelper = require('./routeHelper');
var controllerHelper = require('./controllerHelper');


// mock account controller
var tagssJson = routeHelper.EDIT_DATA_PATH+'/customerAccounts.json';
var controller = controllerHelper.buildController('Account', null, tagssJson);

router.route('/')
  .get(controller.all, routeHelper.renderJson)
  .post(controller.create, routeHelper.renderJson);
router.route('/:accountId')
  .get(controller.get, routeHelper.renderJson)
  .put(controller.update, routeHelper.renderJson)
  .delete(controller.delete, routeHelper.renderJson);


module.exports = router;