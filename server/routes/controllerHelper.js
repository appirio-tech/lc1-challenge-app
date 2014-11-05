/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
/**
 * Helper methods for controller logic.
 *
 */
'use strict';

var _ = require('lodash');
var routeHelper = require('./routeHelper');
var fs = require('fs');


// get all entities
function _getAllEntities(model, referenceModel, req, callback) {
  var filter = {};
  if(referenceModel){
    var refId = routeHelper.getRefIdField(referenceModel.name);
    filter[refId] = req.params[refId];
  }
  model.all(filter).then(function(data){
    console.log('-----------get-all-entities-------', data.body);
    callback(null, data.body.content);
  }, function(data){
    routeHelper.addErrorMessage(req, data.body.content, 404);
    callback(req.error);
  });
}

// find an entity by id
function _findEntityById(model, referenceModel, req, callback) {
  var idParamKey = routeHelper.getRefIdField(model.name);
  var id = Number(req.params[idParamKey]);
  var param = {};
  param[idParamKey] = id;

  if (referenceModel) {
    var refIdKey = routeHelper.getRefIdField(referenceModel.name);
    param[refIdKey] = req.params[refIdKey];
  }

  model.get(param).then(function(data){
    console.log('-----------get-one-entity-------', data.body);
    callback(null, data.body.content);
  }, function(data){
    routeHelper.addErrorMessage(req, data.body.content, 404);
    callback(req.error);
  });
}

function _deleteEntityById(model, referenceModel, req, callback){
  var idParamKey = routeHelper.getRefIdField(model.name);
  var id = Number(req.params[idParamKey]);
  var param = {};
  param[idParamKey] = id;

  if (referenceModel) {
    var refIdKey = routeHelper.getRefIdField(referenceModel.name);
    param[refIdKey] = req.params[refIdKey];
  }
  model.delete(param).then(function(data){
    console.log('-----------delete-one-entity-------', data.body);
    callback(null, data.body);
  }, function(data){
    routeHelper.addErrorMessage(req, data.body.content, 404);
    callback(req.error);
  });
}

/**
 * This function retrieves all entities in the model filtered by referencing model and single field filter.
 * @param model the entity model
 * @param referenceModel the parent model
 * @param req the request
 * @param res the response
 * @param next the next function in the chain
 */
function getEntities(model, referenceModel, req, res, next) {
  _getAllEntities(model, referenceModel, req, function(err, entities) {
    if (err) {
      console.log('Error Message: ' + JSON.stringify(err));
    } else {
      // support simple filtering by field=value
      if (req.query && req.query.filter) {
        var parts = req.query.filter.split('=');
        if (parts.length === 2) {
          var field = parts[0].trim();
          var value = parts[1].trim();
          if (field === 'id' || field.match(/\w*Id$/)) {
            value = Number(value);
          }
          var filteredEntities = _.filter(entities, function(entity) {
            console.log(entity[field], ': ', value);
            return entity[field] === value;
          });
          entities = filteredEntities;
        }
      }
      req.data = entities;
    }
    next();
  });
}

/**
 * This function creates an entity.
 * @param model the entity model
 * @param referenceModel the parent model
 * @param req the request
 * @param res the response
 * @param next the next function in the chain
 */
function createEntity(model, referenceModel, req, res, next) {
  var entity = req.body;
  var postBody = {body: entity};

  if (referenceModel) {
    var refId = routeHelper.getRefIdField(referenceModel.name);
    entity[refId] = Number(req.params[refId]);
    postBody[refId] = Number(req.params[refId]);
  }
  model.create(postBody).then(function(data){
    console.log('---------create-an-entity-------', data.body);
    req.data = data.body;
    next();
  }, function(data){
    routeHelper.addErrorMessage(req, data.body.content, 400);
    next();
  });
}

/**
 * This function gets an entity by id.
 * @param model the entity model
 * @param referenceModel the parent model
 * @param req the request
 * @param res the response
 * @param next the next function in the chain
 */
function getEntity(model, referenceModel, req, res, next) {
  _findEntityById(model, referenceModel, req, function(err, entity) {
    if (!err) {
      req.data = entity;
    }
    next();
  });

}

/**
 * This function updates an entity.
 * @param model the entity model
 * @param referenceModel the parent model
 * @param req the request
 * @param res the response
 * @param next the next function in the chain
 */
function updateEntity(model, referenceModel, req, res, next) {
  var entity = req.body;
  _.forEach(_.keys(entity), function(key){
    if(!entity[key]){
      delete entity[key];
    }
  });
  console.log(entity);
  var postBody = {body: entity};

  var idParamKey = routeHelper.getRefIdField(model.name);
  postBody[idParamKey] = Number(req.params[idParamKey]);

  if (referenceModel) {
    var refId = routeHelper.getRefIdField(referenceModel.name);
    entity[refId] = Number(req.params[refId]);
    postBody[refId] = Number(req.params[refId]);
  }
  model.update(postBody).then(function(data){
    console.log('---------update-an-entity-------', data.body);
    req.data = data.body;
    next();
  }, function(data){
    console.log(JSON.stringify(postBody));
    routeHelper.addErrorMessage(req, data.body.content, 400);
    next();
  });

}

/**
 * This function deletes an entity.
 * @param model the entity model
 * @param referenceModel the parent model
 * @param req the request
 * @param res the response
 * @param next the next function in the chain
 */
function deleteEntity(model, referenceModel, req, res, next) {
  _deleteEntityById(model, referenceModel, req, function(err, result) {
    if (!err) {
      req.data = result;
    }
    next();
  });
  
}

/**
 * Build the CRUD controller for a model.
 */
exports.buildController = function(model, referenceModel) {
  var controller = {};

  // Get an entity.
  controller.get = function(req, res, next) {
    getEntity(model, referenceModel, req, res, next);
  };

  // Create an entity.
  controller.create = function(req, res, next) {
    createEntity(model, referenceModel, req, res, next);
  };

  // Update an entity.
  controller.update = function(req, res, next) {
    updateEntity(model, referenceModel, req, res, next);
  };

  // Retrieve all entities.
  controller.all = function(req, res, next) {
    getEntities(model, referenceModel, req, res, next);
  };

  // Delete an entity.
  controller.delete = function(req, res, next) {
    deleteEntity(model, referenceModel, req, res, next);
  };

  return controller;
};


