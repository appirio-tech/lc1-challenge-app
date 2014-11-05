/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */

/**
 * Helper for mapping consumer methods to Model methods
 */
'use strict';

var config = require('../../config/default.js');
var challengeConsumer = require('../challenge-consumer').Challenge;
var Challenge = new challengeConsumer(config.challengeApiDomain);

exports.Challenge = {
  name: 'Challenge',
  create: Challenge.postChallenges,
  get: Challenge.getChallengesByChallengeId,
  update: Challenge.putChallengesByChallengeId
};

exports.File = {
  name: 'File',
  all: Challenge.getChallengesByChallengeIdFiles,
  create: Challenge.postChallengesByChallengeIdFiles,
  get: Challenge.getChallengesByChallengeIdFilesByFileId,
  delete: Challenge.deleteChallengesByChallengeIdFilesByFileId
};

exports.Requirement = {
  name: 'Requirement',
  all: Challenge.getChallengesByChallengeIdRequirements,
  create: Challenge.postChallengesByChallengeIdRequirements,
  get: Challenge.getChallengesByChallengeIdRequirementsByRequirementId,
  delete: Challenge.deleteChallengesByChallengeIdRequirementsByRequirementId,
  update: Challenge.putChallengesByChallengeIdRequirementsByRequirementId
};
