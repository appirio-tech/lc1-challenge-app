/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
/**
 * Helper methods for swagger client.
 *
 */
'use strict';

var _ = require('lodash');
var routeHelper = require('./routeHelper');


/**
 * Wrap an API method with the middleware.
 * @param apiMethod the API method that returns promise when it's invoked
 * @return the middleware
 */
function wrapApiMethod(apiMethod) {

  return function(req, res, next) {

    // merge params, query and body to parameters
    var params = req.params;
    _.extend(params, req.query);
    params.body = req.body;

    // invoke API method
    var promise = apiMethod(params); // returns promise
    promise.then(function(result) {
      req.data = result.body;
      next();
    }, function(reason) {
      routeHelper.addError(req, reason.body);
      next();
    })
    .done();  // end the promise chain

  };

}

/**
 * Build the CRUD controller for a resource.
 * @param apiMethods the CRUD API methods of a resource
 * @return the controller that has CRUD action method
 */
function buildClientController(apiMethods) {
  var controller = {};

  var actions = ['all', 'create', 'get', 'update', 'delete'];

  _.each(actions, function(action) {
    controller[action] = wrapApiMethod(apiMethods[action]);
  });

  return controller;
};

/**
 * Add a route.
 * @param route the route where new route is added
 * @param httpMethod the http method
 * @param controllerMethod the controller action method
 * @param middlewares the middlewares invoked before controller action method
 * @param renderer the response handler method that invoked at the end of route
 */
function addRoute(route, httpMethod, controllerMethod, middlewares, renderer) {
  if (middlewares && middlewares[controllerMethod]) {
    route[httpMethod](middlewares[controllerMethod], controllerMethod, renderer);
  } else {
    route[httpMethod](controllerMethod, renderer);
  }
}

/**
 * Build the CRUD routes for a controller.
 * @param router the router where new routes are built with
 * @param controller the controller that has CRUD action methods
 * @param resourceUrl the URL of resource
 * @param idParam the name of resource ID parameter
 * @param middlewares the middlewares invoked before controller action method
 */
function buildRoutes(router, controller, resourceUrl, idParam, middlewares) {
  var resourcesRoute = router.route(resourceUrl);
  addRoute(resourcesRoute, 'get', controller.all, middlewares, routeHelper.renderJson);
  addRoute(resourcesRoute, 'post', controller.create, middlewares, routeHelper.renderJson);

  var oneResourceUrl;
  if (resourceUrl.slice(-1) === '/') {
    oneResourceUrl = resourceUrl+':'+idParam;
  } else {
    oneResourceUrl = resourceUrl+'/:'+idParam;
  }
  var oneResourceRoute = router.route(oneResourceUrl);
  addRoute(oneResourceRoute, 'get', controller.get, middlewares, routeHelper.renderJson);
  addRoute(oneResourceRoute, 'put', controller.update, middlewares, routeHelper.renderJson);
  addRoute(oneResourceRoute, 'delete', controller.delete, middlewares, routeHelper.renderJson);
};

module.exports = {
  wrapApiMethod: wrapApiMethod,
  buildClientController: buildClientController,
  buildRoutes: buildRoutes
}
