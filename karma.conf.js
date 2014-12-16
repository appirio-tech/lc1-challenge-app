// Karma configuration
// Generated on Tue Oct 21 2014 08:10:02 GMT-0700 (PDT)

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: 'client',


    // frameworks to use
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-ui-bootstrap-bower/ui-bootstrap.js',
      'bower_components/matchmedia-ng/matchmedia-ng.js',
      'bower_components/angular-placeholder-tai/lib/tai-placeholder.js',
      'bower_components/ng-table/ng-table.js',
      'challenge/challenge.module.js',
      'challenge/challenge.service.js',
      'aaf/aaf.module.js',
      'aaf/aaf.vars.js',
      'aaf/utils.service.js',
      'aaf/layout/header.service.js',
      'aaf/layout/profile.controller.js',
      'aaf/components/checkbox.directive.js',
      'aaf/components/force-click.directive.js',
      'aaf/components/num-fixed-length.directive.js',
      'aaf/components/off-click.directive.js',
      'aaf/components/resize.directive.js',

      'manage-challenge/app.js',
      'manage-challenge/app.routes.js',
      'manage-challenge/app.vars.js',
      'manage-challenge/challenge-list/challenge-list.controller.js',
      'manage-challenge/challenge-list/*.spec.js'


    ],


    // list of files to exclude
    exclude: [

    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
    // - PhantomJS
    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
    browsers: ['Chrome'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
