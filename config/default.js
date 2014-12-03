'use strict';

var path = require('path'),
  // rootPath shouldn't end with forward slash
  rootPath = path.normalize(__dirname + '/..');
var env = require('node-env-file');


function getEnv(name) {
  /*  if production and don't load .env file
   * must set NODE_ENV on heroku to production for this to work
   */
  if ( process.env.NODE_ENV !== 'production' ) {
    console.log('NOT running production');
    console.log('dir', __dirname);
    console.log('path: ', path.join(__dirname, '../env_sample'));
    env(path.join(__dirname, '../.env'));
    if (!process.env.hasOwnProperty(name)) {
      throw new Error('Env setting: ' + name + ' is not configured!');
    }
  return process.env[name].trim();
  } else {
    console.log('Running PRODUCTION');
  }
}


module.exports = {
  challenge: {
    apiUrl: getEnv('CHALLENGE_API'),
    defaultTitle: 'Untitled Challenge'
  },
  root: rootPath,
  tcAPI: getEnv('TC_API'),
  auth0: {
    Domain: process.env.TC_AUTH0_DOMAIN || 'topcoder.auth0.com',
    /* use process.env first, then .env file, last set here */
    Client: process.env.TC_AUTH0_CLIENT || getEnv('TC_AUTH0_CLIENT') || 'foo',
    Secret: process.env.TC_AUTH0_SECRET || getEnv('TC_AUTH0_SECRET') || 'bar'
  },
  authDisabled: getEnv('AUTH_DISABLED'),

  /**
   * URLs
   */
  tcWWW: getEnv('TC_WWW_URL'),
  tcProjectBase: getEnv('TC_PROJECT_BASE_URL'),

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
