/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';

var express = require('express');
var router = express.Router();
var _ = require('lodash');
var routeHelper = require('./routeHelper');
var clientHelper = require('./clientHelper');
var localFileUploader = require('./localUploadMiddleware');
//var config = require("../../config/config");
var Challenge = require('../challenge-consumer').Challenge;
var controllerHelper = require('./controllerHelper');
var config = require('config');
/**
 * Upload middleware
 * @type {Object}
 */
var uploadMiddleware;

/**
 * Initializing upload middleware based on configuration for storage provider
 */
var storageProviders = config.storageProviders,
  providerName = config.uploads.storageProvider;
  //console.log('the var storageProviders is ', storageProviders);

if(storageProviders.hasOwnProperty(providerName)) {
  var providerConfig = storageProviders[providerName];
  uploadMiddleware = require(config.root + '/' + providerConfig.path)(providerConfig.options, config);
} else {
  throw new Error(providerName + 'is not configured in Storage Providers');
}

// Challenge client for Swagger Challenge class
var client = new Challenge(config.challenge.apiUrl);


/**
 * Challenge resource
 */

// API methods for challenge
var challengeApiMethods = {
  all: client.getChallenges,
  create: client.postChallenges,
  get: client.getChallengesByChallengeId,
  update: client.putChallengesByChallengeId,
  delete: client.deleteChallengesByChallengeId
};
// build challenge controller
var challengeController = clientHelper.buildClientController(challengeApiMethods);

// custom routes
router.route('/configuration')
  .get(getChallengeConfiguration, routeHelper.renderJson);
router.route('/:challengeId/launch')
  .post(launchChallenge, challengeController.update, routeHelper.renderJson);

  /*  from master
  .post(challengeController.get, launchChallenge, challengeController.update, routeHelper.renderJson);

// mock requirement controller
var requirementJsonFile = routeHelper.EDIT_DATA_PATH+'/requirements.json';
var requirementController = controllerHelper.buildController('Requirement', 'Challenge', requirementJsonFile);

router.route('/:challengeId/requirements')
  .get(requirementController.all, routeHelper.renderJson)
  .post(requirementController.create, routeHelper.renderJson);
router.route('/:challengeId/requirements/:requirementId')
  .get(requirementController.get, routeHelper.renderJson)
  .put(requirementController.update, routeHelper.renderJson)
  .delete(requirementController.delete, routeHelper.renderJson);


// mock file controller
var fileJsonFile = routeHelper.EDIT_DATA_PATH+'/files.json';
var fileController = controllerHelper.buildController('File', 'Challenge', fileJsonFile);

router.route('/:challengeId/files')
  .get(fileController.all, routeHelper.renderJson)
  .post(uploadMiddleware.handleUpload, fileController.create, routeHelper.renderJson);
router.route('/:challengeId/files/:fileId')
  .get(fileController.get, routeHelper.renderJson)
  .put(fileController.update, routeHelper.renderJson)
  .delete(fileController.delete, routeHelper.renderJson);


// mock prize controller
var prizeJsonFile = routeHelper.EDIT_DATA_PATH+'/prizes.json';
var prizeController = controllerHelper.buildController('Prize', 'Challenge', prizeJsonFile);
router.route('/:challengeId/prizes')
  .get(prizeController.all, routeHelper.renderJson)
  .post(prizeController.create, routeHelper.renderJson);
router.route('/:challengeId/prizes/:prizeId')
  .get(prizeController.get, routeHelper.renderJson)
  .put(prizeController.update, routeHelper.renderJson)
  .delete(prizeController.delete, routeHelper.renderJson);
  */

// build routes for challenge
clientHelper.buildRoutes(router, challengeController, '/', 'challengeId');

// launch challenge, change the status to active
function launchChallenge(req, res, next) {
  // challenge is in req.body
  req.body.status = 'SUBMISSION';
  next();
}

// get challenge configuration
function getChallengeConfiguration(req, res, next) {
  req.data = config.challenge;
  next();
}


/**
 * Requirement resource
 */

// API methods for requirement
var requirementApiMethods = {
  all: client.getChallengesByChallengeIdRequirements,
  create: client.postChallengesByChallengeIdRequirements,
  get: client.getChallengesByChallengeIdRequirementsByRequirementId,
  update: client.putChallengesByChallengeIdRequirementsByRequirementId,
  delete: client.deleteChallengesByChallengeIdRequirementsByRequirementId
};
// build requirement controller
var requirementController = clientHelper.buildClientController(requirementApiMethods);
// build routes for requirement
clientHelper.buildRoutes(router, requirementController, '/:challengeId/requirements', 'requirementId');


/**
 * File resource
 */

// API methods for file
var fileApiMethods = {
  all: client.getChallengesByChallengeIdFiles,
  create: client.postChallengesByChallengeIdFiles,
  get: client.getChallengesByChallengeIdFilesByFileId,
  update: client.putChallengesByChallengeIdFilesByFileId,
  delete: client.deleteChallengesByChallengeIdFilesByFileId
};
// build file controller
var fileController = clientHelper.buildClientController(fileApiMethods);

// build routes for file
clientHelper.buildRoutes(router, fileController, '/:challengeId/files', 'fileId');

//router.route('/:challengeId/uploadfile')
  //.post(localFileUploader.handleUpload, routeHelper.renderJson);


/**
 * Participant resource
 */

// API methods for participant
var participantApiMethods = {
  all: client.getChallengesByChallengeIdParticipants,
  create: client.postChallengesByChallengeIdParticipants,
  get: client.getChallengesByChallengeIdParticipantsByParticipantId,
  update: client.putChallengesByChallengeIdParticipantsByParticipantId,
  delete: client.deleteChallengesByChallengeIdParticipantsByParticipantId
};
// build participant controller
var participantController = clientHelper.buildClientController(participantApiMethods);
// build routes for participant
clientHelper.buildRoutes(router, participantController, '/:challengeId/participants', 'participantId');


/**
 * Submission resource
 */

// API methods for submission
var submissionApiMethods = {
  all: client.getChallengesByChallengeIdSubmissions,
  create: client.postChallengesByChallengeIdSubmissions,
  get: client.getChallengesByChallengeIdSubmissionsBySubmissionId,
  update: client.putChallengesByChallengeIdSubmissionsBySubmissionId,
  delete: client.deleteChallengesByChallengeIdSubmissionsBySubmissionId
};
// build submission controller
var submissionController = clientHelper.buildClientController(submissionApiMethods);
// build routes for submission
clientHelper.buildRoutes(router, submissionController, '/:challengeId/submissions', 'submissionId');


/**
 * Scorecard resource
 */

// API methods for scorecard
var scorecardApiMethods = {
  all: client.getChallengesByChallengeIdScorecards,
  create: client.postChallengesByChallengeIdScorecards,
  get: client.getChallengesByChallengeIdScorecardsByScorecardId,
  update: client.putChallengesByChallengeIdScorecardsByScorecardId,
  delete: client.deleteChallengesByChallengeIdScorecardsByScorecardId
};
// build scorecard controller
var scorecardController = clientHelper.buildClientController(scorecardApiMethods);
// build routes for scorecard
clientHelper.buildRoutes(router, scorecardController, '/:challengeId/scorecards', 'scorecardId');


/**
 * ScorecardItem resource
 */

// API methods for scorecardItem
var scorecardItemApiMethods = {
  all: client.getChallengesByChallengeIdScorecardsByScorecardIdScorecardItems,
  create: client.postChallengesByChallengeIdScorecardsByScorecardIdScorecardItems,
  get: client.getChallengesByChallengeIdScorecardsByScorecardIdScorecardItemsByScorecardItemId,
  update: client.putChallengesByChallengeIdScorecardsByScorecardIdScorecardItemsByScorecardItemId,
  delete: client.deleteChallengesByChallengeIdScorecardsByScorecardIdScorecardItemsByScorecardItemId
};
// build scorecardItem controller
var scorecardItemController = clientHelper.buildClientController(scorecardItemApiMethods);
// build routes for scorecardItem
clientHelper.buildRoutes(router, scorecardItemController, '/:challengeId/scorecards/:scorecardId/scorecardItems', 'scorecardItemId');


module.exports = router;
