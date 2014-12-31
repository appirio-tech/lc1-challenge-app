## Install


1. run `npm install`
2. cp env_sample to .env

>The env sample contains the the correct `CHALLENGE_API` and will allow you to connect to the dev db and instantlly see shared data.   If should be noted that the `AWS` setting and `TC_AUTH` vars have dummy values so you wont be able to upload a file.   You are welcome to switch to to you own aws keys or set the STORAGE_PROVIDER to local.  IF you set STORAGE_PROVIDER=local you will also need to create the following directories in the root folder: `upload` and `temp` however at the current state the upload (even if set to local ) is expecting an s3 response and will throw an error.

## Run

start with `grunt` or `node server/web.js`

## Testing

End-to-End testing using [http://angular.github.io/protractor/#/api](protractor) has been added to the app. For further documentation, please refer to `docs/e2e_challenge_testing.md`.
1. Execute `npm run update-webdriver` to install the chromerdirver for selenium.
2. In another widonw start the app with `grunt`
3.  Run the tests with  `grunt test:challengeEdit`
4. You should see a new chrome window open and the remote control script running
5. Some test may fail without the S3 .env vars set.



## Heroku
you may need to add a buildpack for node and grunt
`heroku config:set BUILDPACK_URL=https://github.com/mbuchetics/heroku-buildpack-nodejs-grunt.git`

## using Amazon S3 storage
The default setting use local storage, to use S3 set the following values in your .env file or env vars
```
STORAGE_PROVIDER=s3
AWS_KEY=yourkey
AWS_SECRET=yoursecret
AWS_BUCKET=yourbuckt
AWS_REGION=youregegion(us-east-1)
```

**Enviromential Variables (updated 12/31/2014)**

| Name of variable	| Default value|
|---|---|
| AUTH_ENABLED | false |
| AWS_KEY | yourkey |
| AWS_SECRET | yoursecret |
| AWS_BUCKET | yourbuckt |
| AWS_REGION | youregegion(us-east-1) |
| CHALLENGE_API | http://dev-lc1-challenge-service.herokuapp.com (if you are running the challenge app you may need to set this to localhost) |
| STORAGE_PROVIDER | `S3` or `local` (currently local is not working ) |
| TC_AUTH0_CLIENT | foo |
| TC_AUTH0_SECRET | bar |
| TC_PROJECT_BASE_URL | http://localhost |
| TC_WWW_URL | http://localhost |
| USER_API | http://dev-lc1-user-service.herokuapp.com |



## client generation from swagger, both node and angular services

1.  add npm modules required for code gen  

 ```
  "grunt": "^0.4.5",
    "grunt-swagger-js-codegen": "^0.2.11",
    "load-grunt-tasks": "^1.0.0",
```
2.  Create Grunt file
3. run `grunt swagger-clients`


## tc-auth
 you must supply enviromential variables for both  `TC_AUTH0_CLIENT` and `TC_AUTH0_SECRET` you can set them to any value for the time being until we have the config dir set up.  If you have created the .env file you can ignore this.
 ```export TC_AUTH0_CLIENT=foo```
 ```export TC_AUTH0_SECRET=bar```


 > grunt has been added to the app so you can now start it with `grunt` and nodemon will watch for changes in *.js or *.html files and restart if they change
