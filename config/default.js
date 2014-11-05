'use strict';

module.exports = {
  challengeServiceURI: 'http://lc1-challenge-service.herokuapp.com/',
  auth0: {
    Domain: process.env.TC_AUTH0_DOMAIN || 'serenity-tc.auth0.com',
    Client: process.env.TC_AUTH0_CLIENT || 'foo',
    Secret: process.env.TC_AUTH0_SECRET || 'bar'
  }
};
