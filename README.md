## Install

install in 2 steps:

**First**
`npm install`

**Second**
Change directory to client and run 'bower install' to install the required angulajs bower components
i.e. 'cd client && bower install'

**Third**
you must create a `.env` file with the following minimum settings
```
TC_AUTH0_CLIENT=foo
TC_AUTH0_SECRET=bar
STORAGE_PROVIDER=local or s3 depending on your choice
```
you may copy `env_sample` to `.env`

## Run

start with `grunt` or `node server/web.js`

## Heroku
you may need to add a buildpack for node and grunt
`heroku config:set BUILDPACK_URL=https://github.com/mbuchetics/heroku-buildpack-nodejs-grunt.git`

## using Amazon S3 storage
The default setting use local storage, to use S3 set the following values in your .env file or env vars
```STORAGE_PROVIDER=s3
AWS_KEY=yourkey
AWS_SECRET=yoursecret
AWS_BUCKET=yourbuckt
AWS_REGION=youregegion(us-east-1)
```

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
