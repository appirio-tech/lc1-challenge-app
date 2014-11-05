/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';

var express = require('express');
var router = express.Router();
var routeHelper = require('./routeHelper');
var controllerHelper = require('./controllerHelper');
var localFileUploader = require('./localUploadMiddleware');
var apiConsumerHelper = require('../libs/apiConsumerHelper');
var Challenge = apiConsumerHelper.Challenge;
var File = apiConsumerHelper.File;
var Requirement = apiConsumerHelper.Requirement;


// challenge controller
var challengeController = controllerHelper.buildController(Challenge, null);

router.route('/')
  .get(challengeController.all, routeHelper.renderJson)
  .post(challengeController.create, routeHelper.renderJson);
router.route('/:challengeId')
  .get(challengeController.get, routeHelper.renderJson)
  .put(challengeController.update, routeHelper.renderJson)
  .delete(challengeController.delete, routeHelper.renderJson);
router.route('/:challengeId/launch')
  .post(challengeController.update, routeHelper.renderJson);

// requirement controller
var requirementController = controllerHelper.buildController(Requirement, Challenge);

router.route('/:challengeId/requirements')
  .get(requirementController.all, routeHelper.renderJson)
  .post(requirementController.create, routeHelper.renderJson);
router.route('/:challengeId/requirements/:requirementId')
  .get(requirementController.get, routeHelper.renderJson)
  .put(requirementController.update, routeHelper.renderJson)
  .delete(requirementController.delete, routeHelper.renderJson);


// file controller
var fileController = controllerHelper.buildController(File, Challenge);

router.route('/:challengeId/files')
  .get(fileController.all, routeHelper.renderJson)
  .post(localFileUploader.handleUpload, fileController.create, routeHelper.renderJson);
router.route('/:challengeId/files/:fileId')
  .get(fileController.get, routeHelper.renderJson)
  .put(fileController.update, routeHelper.renderJson)
  .delete(fileController.delete, routeHelper.renderJson);


module.exports = router;
