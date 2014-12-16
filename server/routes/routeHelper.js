/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';

var _ = require('lodash');


// data folder path
exports.MANAGE_DATA_PATH = './client/manage-challenge/data';
exports.EDIT_DATA_PATH = './client/edit-challenge/data';

/**
 * return the req parameter key or foreign key from model name
 * @param refModel the model object
 */
exports.getRefIdField = function(refModel) {
  return refModel.charAt(0).toLowerCase() + refModel.slice(1) + 'Id';
};

/**
 * Add Error object to request.
 * @param req the request
 * @param err the origianl Error
 * @param errCode the error code
 */
exports.addError = function(req, err, errCode) {
  req.error = {};

  if (err instanceof Array) {   // Sequelize returns array
    req.error.message = err[0].message;
    if (req.error.message.indexOf('violates') > -1 || req.error.message.indexOf('constraint') > -1) {
      errCode = 400;  // return bad request
    }
  } else if (err && err.result && err.content) {   // from swagger API
    req.error = err;
  } else if (err.message) {
    req.error.message = err.message;
    if (req.error.message.indexOf('violates') > -1 || req.error.message.indexOf('constraint') > -1) {
      errCode = 400;  // return bad request
    }
  } else if (err.errors && err.errors instanceof Array) {
    req.error.errors = err.errors;
  } else if (typeof err === 'string') {  // error from a127 middleware validation error
      req.error.message = err;
  } else {
    req.error.message = 'request failed';
  }
  req.error.code = errCode || req.error.code || 500;
};

/**
 * Add error message to request.
 * @param req the request
 * @param errMsg the error message
 * @param errCode the error code
 */
exports.addErrorMessage = function(req, errMsg, errCode) {
  req.error = {};
  req.error.message = errMsg;
  req.error.code = errCode || req.error.code || 500;
};

/**
 * Add validation error to request.
 * @param req the request
 * @param errMsg the error message
 */
exports.addValidationError = function(req, errMsg) {
  if (!req.error) {
    req.error = {};
  }
  if (!req.error.errors) {
    req.error.errors = [];
  }
  req.error.code = 400;
  req.error.errors.push(new Error(errMsg));
};

/**
 * This method renders result (req.error or req.data) as JSON.
 * @param req the request
 * @param res the response
 */
exports.renderJson = function(req, res) {
  if (req.error) {
    if (req.error.errors) {   // validation errors
      res.status(req.error.code).json({
        result: {
          success: false,
          status : req.error.code,
        },
        content : _.pluck(_.values(req.error.errors), 'message').join('. ')
      });
    } else if (req.error.result && req.error.content) {   // swagger error response
      delete req.error.code;
      res.status(req.error.result.status).json(req.error);
    } else {
      res.status(req.error.code).json({
        result: {
          success: false,
          status : req.error.code,
        },
        content : req.error.message
      });
    }
  } else if (req.data) {
    res.status(200).json(req.data);
  } else {
    res.status(404).json({
      result: {
        success: false,
        status : 404,
      },
      content: 'The resource is not found'
    });
  }
};
