/*
 * Copyright (C) 2014 TopCoder Inc., All Rights Reserved.
 */
/**
 * Contains general configuration for app.
 *
 */
'use strict';

var env = require('node-env-file'),
path = require('path');

env(path.join(__dirname, '../.env'));

/**
 * Get an environmental setting
 * @param {String} name the name of setting
 * @returns {String} the value
 * @throws {Error} if setting is not defined
 */
function getEnv(name) {
  if (!process.env.hasOwnProperty(name)) {
    throw new Error('Env setting: ' + name + ' is not configured!');
  }
  return process.env[name].trim();
}

module.exports = {
  oauth0: {
    client: getEnv('TC_AUTH0_CLIENT'),
    secret: getEnv('TC_AUTH0_SECRET')
  },
  challenge: {
    apiUrl: 'http://lc1-challenge-service.herokuapp.com',
    defaultTitle: 'Untitled Challenge'
  }

};