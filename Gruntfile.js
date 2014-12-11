'use strict';



module.exports = function(grunt) {

  grunt.initConfig({

    protractor: {
      options: {
        configFile: "protractor/protractor.conf", // Default config file
        keepAlive: true, // If false, the grunt process stops when the test fails.
        noColor: false // If true, protractor will not use colors in its output.
      },
      challengeEdit: {
        options: {
          configFile: "config/challenge-edit.protractor.conf", // Config file for Challenge Edit Testing
        }
      },
    },


    'swagger-js-codegen': {
      options: {
        apis: [
        {
          swagger: 'http://lc1-challenge-service.herokuapp.com/api-docs', // The location of the swagger file
          moduleName: 'challenge-consumer', // The name of the file and class
          className: 'Challenge',
        },
        {
          swagger: 'http://lc1-discussion-service.herokuapp.com/api-docs', // The location of the swagger file
          moduleName: 'discussion-consumer', // The name of the file and class
          className: 'Discussion',
        }],
        dest: 'server' // Where the file should be generated.
      },
      dist: {

      }
    },

    nodemon: {
      dev: {
        script: 'server/web.js',
        ignore: ['node_modules/**'],
          ext: 'js,html',
          nodeArgs: ['--debug'],
          delayTime: 1,
          cwd: __dirname
        }
      }

  });

  //Load NPM tasks
  require('load-grunt-tasks')(grunt);


  //grunt.registerTask('default', ['swagger-js-codegen']);
  grunt.registerTask('default', ['nodemon']);


  // generate swagger clients
  grunt.registerTask('swagger-clients', 'generate challenge angular service', function () {
    grunt.task.run('swagger-js-codegen');
  });

  // Register end-to-end testing task
  grunt.registerTask('test', 'end-to-end testing for challenge service', function(option) {
    if (option == null) {
      grunt.warn('Default option currently does not serve any purpose, other than to demonstrate context-sensitive grunt works.');
    } else {
      grunt.task.run('protractor:'+option);
    }
  });



};
