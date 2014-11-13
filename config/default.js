'use strict';

var path = require('path'),
  // rootPath shouldn't end with forward slash
  rootPath = path.normalize(__dirname + '/..');
var env = require('node-env-file');

env(path.join(__dirname, '../.env'));

function getEnv(name) {
  if (!process.env.hasOwnProperty(name)) {
    throw new Error('Env setting: ' + name + ' is not configured!');
  }
  return process.env[name].trim();
}


module.exports = {
  //TODO from config.js clean up reduncacy later
  oauth0: {
    client: getEnv('TC_AUTH0_CLIENT'),
    secret: getEnv('TC_AUTH0_SECRET')
  },
  challenge: {
    apiUrl: 'http://lc1-challenge-service.herokuapp.com',
    defaultTitle: 'Untitled Challenge'
  },

  // end TODO

  root: rootPath,
  challengeServiceURI: 'http://lc1-challenge-service.herokuapp.com/',
  auth0: {
    Domain: process.env.TC_AUTH0_DOMAIN || 'serenity-tc.auth0.com',
    Client: process.env.TC_AUTH0_CLIENT || 'foo',
    Secret: process.env.TC_AUTH0_SECRET || 'bar'
  },
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
    s3: {
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
