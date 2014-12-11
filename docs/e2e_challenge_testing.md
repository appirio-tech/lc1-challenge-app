# [[serenity] challenge app tests](https://www.topcoder.com/challenge-details/30047171/?type=develop)

## Getting Started

1. For End-to-End Testing, it requires you to have [Google Chrome](http://www.google.com/chrome/) as the browser installed.
2. Open Terminal and point the directory to the root folder of this app.
3. Execute `npm run update-webdriver`.
4. To start testing, execute `grunt test:challengeEdit`.  (the app must be running in another terminal `grunt`)')
5. There are 10 tests, it should result in 9 correct tests and 1 incorrect test (it will fail to delete because the app currently cannot delete challange that has requirements).

## Protractor Configuration

Default Configurations are set up in `config/protractor.conf.js`. It currently doesn't serve any purpose except for being skeleton config file. If you want to make a new test, you can copy default config file and rename it. For this challenge, the configuration file used is `config/challenge-edit.protractor.conf.js`. Of all configurable parameters, the most important one that differentiate each configs is `specs`. It lists the spec files that are going to be tested using this config. For example:

```
specs: [
  '../client/edit-challenge/test_files/*e2e.js'
],
```

Config with above specs will test using all files matched with `*e2e.js` located in `../client/edit-challenge/test_files/`.

## Grunt Configuration

Grunt config file is located in `Gruntfile.js`. For testing, these configurations are the most important one:

```
protractor: {
  options: {
    configFile: "protractor/protractor.conf", // Default config file
    keepAlive: true, // If false, the grunt process stops when the test fails.
    noColor: false // If true, protractor will not use colors in its output.
  },
  challengeEdit: {
    options: {
      configFile: "protractor/challenge-edit.protractor.conf", // Config file for Challenge Edit Testing
    }
  },
},
```

All configurables in `options` are the default one. It will be overridden by a more specific option. For example, `challengeEdit` option also specifies its own `configFile`. This option will override `configFile` in the default option. So if you want to create your own test, you can add another specific option below `challengeEdit`. For example:

```
protractor: {
  options: {
    configFile: "protractor/protractor.conf", // Default config file
    keepAlive: true, // If false, the grunt process stops when the test fails.
    noColor: false // If true, protractor will not use colors in its output.
  },
  challengeEdit: {
    options: {
      configFile: "protractor/challenge-edit.protractor.conf", // Config file for Challenge Edit Testing
    }
  },
  yourCustomTest: {
    options: {
      configFile: "protractor/your-custom-test.protractor.conf", // Config file for your own Testing
    }
  }
},
```

## Grunt Test

Execute `grunt test` to run the test with default configuration file (which doesn't do anything currently). Execute `grunt test:challengeEdit` to test Challenge Edit. If you specify your own test target, like `yourCustomTest`, just change challengeEdit with the test target, e.g. `grunt test:yourCustomTest`.

## Quick Steps to Create Your Own Test

1. Make your own testing files. Example can be found in `client/edit-challenge/test_files/edit-challenge-e2e.js`.
2. Copy `protractor.conf.js` and rename it with a unique name. Open it and change your specs to include the created testing files.
3. Open `gruntfile.js`, add another protractor option with a unique name. Override default configFile with the created protractor file in step 2.
4. Execute `grunt test:` + your option name.

## Git file changes

modified:   .gitignore
deleted:    client/edit-challenge/data/challenges.json
deleted:    client/edit-challenge/data/files.json
deleted:    client/edit-challenge/data/prizes.json
deleted:    client/edit-challenge/data/requirements.json
deleted:    client/edit-challenge/data/tags.json
modified:   client/edit-challenge/js/app.js
modified:   client/edit-challenge/js/controllers/challenge-file-upload-controller.js
modified:   client/edit-challenge/js/controllers/create-challenge-controller.js
modified:   client/edit-challenge/js/controllers/requirements-controller.js
modified:   client/edit-challenge/js/services/challenge-service.js
modified:   client/edit-challenge/public-info.html
modified:   client/edit-challenge/templates/challenge-edit.html
modified:   client/edit-challenge/templates/prizes.html
modified:   client/edit-challenge/templates/requirement.html
new file:   config/config.js
new file:   docs/edit_api_usage_30046908.md
new file:   env_sample
modified:   package.json
modified:   server/appirio_node_modules/tc-server-auth/index.js
modified:   server/challenge-consumer.js
modified:   server/routes/challenges.js
new file:   server/routes/clientHelper.js
modified:   server/routes/localUploadMiddleware.js
modified:   server/routes/routeHelper.js
deleted:    server/routes/tags.js
modified:   server/web.js
