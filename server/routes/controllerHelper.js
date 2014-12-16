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


// get all data from json file
function _getDataFromJson(jsonfile, callback) {
  fs.readFile(jsonfile, function(err, fileData) {
    if (err) {
      callback(err);
    } else {
      var entities = JSON.parse(fileData);
      callback(null, entities);
    }
  });
}

// get all entitities data by filtering
function _getAllEntities(model, referenceModel, jsonfile, req, callback) {
  _getDataFromJson(jsonfile, function(err, entities) {
    if (err) {
      callback(err);
    } else {
      if (referenceModel) {
        var refId = routeHelper.getRefIdField(referenceModel);
        var filteredEntities = _.filter(entities, function(entity) {
          return entity[refId] === Number(req.params[refId]);
        });
        entities = filteredEntities;
      }
    }
    callback(null, entities);
  });
}

// find an entity by id
function _findEntityById(model, referenceModel, jsonfile, req, callback) {
  _getAllEntities(model, referenceModel, jsonfile, req, function(err, entities) {
    if (err) {
      routeHelper.addError(req, err);
    } else {
      var idParam = routeHelper.getRefIdField(model);
      var id = Number(req.params[idParam]);
      for(var i=0; i<entities.length; i++) {
        if (entities[i].id === id) {
          callback(null, entities[i]);
          return;
        }
      }
      routeHelper.addErrorMessage(req, "Entity not found", 404);
    }
    callback(req.error);
  });
}

/**
 * This function retrieves all entities in the model filtered by referencing model and single field filter.
 * @param model the entity model
 * @param referenceModel the parent model
 * @param jsonfile the json data file
 * @param req the request
 * @param res the response
 * @param next the next function in the chain
 */
function getEntities(model, referenceModel, jsonfile, req, res, next) {
  _getAllEntities(model, referenceModel, jsonfile, req, function(err, entities) {
    if (err) {
      routeHelper.addError(req, err);
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

  if (referenceModel) {
    var refId = routeHelper.getRefIdField(referenceModel);
    entity[refId] = req.params[refId];
    // add id same as reference model, the json data file was created to have a same id as parent model.
    // please ignore the id.
    entity.id = req.params[refId];
  }
  if (!entity.id) {
    entity.id = _.random(1, 10);    // add random id
  }
  // print the created entity to the console
  console.log('\nCreate '+model+': ', entity);
  req.data = entity;
  next();
}

/**
 * This function gets an entity by id.
 * @param model the entity model
 * @param referenceModel the parent model
 * @param jsonfile the json data file
 * @param req the request
 * @param res the response
 * @param next the next function in the chain
 */
function getEntity(model, referenceModel, jsonfile, req, res, next) {
  _findEntityById(model, referenceModel, jsonfile, req, function(err, entity) {
    if (!err) {
      // print the entity found to the console
      console.log('\nGet '+model+': ', entity);
      req.data = entity;
    }
    next();
  });

}

/**
 * This function updates an entity.
 * @param model the entity model
 * @param referenceModel the parent model
 * @param jsonfile the json data file
 * @param req the request
 * @param res the response
 * @param next the next function in the chain
 */
function updateEntity(model, referenceModel, jsonfile, req, res, next) {
  _findEntityById(model, referenceModel, jsonfile, req, function(err, entity) {
    if (!err) {
      _.extend(entity, req.body);
      // print the updated entity to console
      console.log('\nUpdate '+model+': ', entity);
      req.data = entity;
    }
    next();
  });

}

/**
 * This function deletes an entity.
 * @param model the entity model
 * @param referenceModel the parent model
 * @param jsonfile the json data file
 * @param req the request
 * @param res the response
 * @param next the next function in the chain
 */
function deleteEntity(model, referenceModel, jsonfile, req, res, next) {
  _findEntityById(model, referenceModel, jsonfile, req, function(err, entity) {
    if (!err) {
      // print the deleted entity to console
      console.log('\nDelete '+model+': ', entity);
      req.data = entity;
    }
    next();
  });
  
}

/**
 * Build the CRUD controller for a model.
 */
exports.buildController = function(model, referenceModel, jsonfile) {
  var controller = {};

  // Get an entity.
  controller.get = function(req, res, next) {
    getEntity(model, referenceModel, jsonfile, req, res, next);
  };

  // Create an entity.
  controller.create = function(req, res, next) {
    createEntity(model, referenceModel, req, res, next);
  };

  // Update an entity.
  controller.update = function(req, res, next) {
    updateEntity(model, referenceModel, jsonfile, req, res, next);
  };

  // Retrieve all entities.
  controller.all = function(req, res, next) {
    getEntities(model, referenceModel, jsonfile, req, res, next);
  };

  // Delete an entity.
  controller.delete = function(req, res, next) {
    deleteEntity(model, referenceModel, jsonfile, req, res, next);
  };

  return controller;
};


