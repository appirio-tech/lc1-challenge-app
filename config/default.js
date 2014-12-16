'use strict';

var path = require('path'),
    fs = require('fs'),
  // rootPath shouldn't end with forward slash
  rootPath = path.normalize(__dirname + '/..');
var env = require('node-env-file');

if (fs.existsSync(path.join(__dirname, '../.env'))) {
  env(path.join(__dirname, '../.env'));
}

function getVal(name, defaultVal) {
  if (process.env.hasOwnProperty(name)) {
    return process.env[name].trim();
  }
  else if (defaultVal) {
    return defaultVal;
  }
  else {
    throw new Error('Env setting: ' + name + ' is not configured!');
  }
}

module.exports = {
  challenge: {
    apiUrl: getVal('CHALLENGE_API'),
    defaultTitle: 'Untitled Challenge'
  },
  root: rootPath,
  userAPI: getVal('USER_API'),
  auth0: {
    Domain: getVal('TC_AUTH0_DOMAIN', 'topcoder.auth0.com'),
    /* use process.env first, then .env file, last set here */
    Client: getVal('TC_AUTH0_CLIENT', 'foo'),
    Secret: getVal('TC_AUTH0_SECRET', 'bar')
  },
  authDisabled: getVal('AUTH_DISABLED'),

  /**
   * URLs
   */
  tcWWW: getVal('TC_WWW_URL'),
  tcProjectBase: getVal('TC_PROJECT_BASE_URL'),

  /**
   * Uploads configuration
   * @type {Object}
   */
  uploads : {
    /**
     * Should be configured in storageProviders
     * @type {String}
     */

    storageProvider: process.env.STORAGE_PROVIDER || 'local'
  },
  /**
   * Storage providers can be configured here
   * A storage provider should support two operations
   * store and delete
   * @type {Object}
   */
  storageProviders : {
    local: {
      /**
       * This path is needed to load the provider during application load
       * NOTE: The path is relative to root of application and should not end in a forward slash
       * @type {String}
       */
      path: './server/routes/localUploadMiddleware',
      options: {
        /**
         * Unique Id for this storage provider
         * NOTE: Every storage provider should have a unique id
         * @type {Number}
         */
        id: 1,
        /**
         * These are upload directories for local storage provider
         * @type {String}
         */
        uploadsDirectory: './upload',
        tempDir: './temp'
      }
    },
    S3: {
      /**
       * This path is needed to load the provider during application load
       * NOTE: The path is relative to root of application and should not end in a forward slash
       * @type {String}
       */
      path: './server/routes/s3UploadMiddleware',
      options: {
        /**
         * Unique Id for this storage provider
         * NOTE: Every storage provider should have a unique id
         * @type {Number}
         */
        id: 2,
        /**
         * AWS configuration for s3 upload service
         * @type {Object}
         */
        aws: {
          secure: false,
          key: process.env.AWS_KEY,
          secret: process.env.AWS_SECRET,
          bucket: process.env.AWS_BUCKET,
          region: process.env.AWS_REGION

        }
      }
    }
  }
};

//console.log('DEBUG: from default.js, using auth0: %j',  module.exports.auth0 );
//console.log('DEBUG: the process.env.NODE_ENV is ', process.env.NODE_ENV );
//console.log('DEBUG: AWS_KEY is ', process.env.AWS_KEY);
