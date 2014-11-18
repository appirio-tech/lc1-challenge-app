/*jshint -W069 */
/**
 *
 * @class Discussion
 * @param {string} domain - The project domain
 */
module.exports.Discussion = function(domain) {
    'use strict';

    var request = require('request');
    var Q = require('q');

    /**
     * Create a new discusion
     * @method
     * @name Discussion#postDiscussions
     * @param {{}} body -
     *
     */
    this.postDiscussions = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var path = '/discussions';

        var body;
        var queryParameters = {};
        var headers = {};

        if (parameters.body !== undefined) {
            body = parameters['body'];
        }

        if (parameters['body'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: body'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        request({
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            json: body,
            rejectUnauthorized: false
        }, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Get Discussions
     * @method
     * @name Discussion#getDiscussions
     * @param {{string}} filter - {fieldName1}={fieldValue1}&...{fieldNameN}>{fieldValueN}. String value needs to be surrounded by single quotation(‘). fieldValue can contain multiple values using in() format {fieldName}=in({fieldValue1},{fieldValue2}). Operations can be =, > or <.  < and > operations are only for number, integers and dates
     * @param {{integer}} limit - maximum number of records to return
     * @param {{integer}} offset - id to start return values
     * @param {{string}} orderBy - field name to sort {asc [nulls {first | last} ] | desc  [nulls {first | last} }
     * @param {{string}} fields - fields parameters to get partial response data
     *
     */
    this.getDiscussions = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var path = '/discussions';

        var body;
        var queryParameters = {};
        var headers = {};

        if (parameters['filter'] !== undefined) {
            queryParameters['filter'] = parameters['filter'];
        }

        if (parameters['limit'] !== undefined) {
            queryParameters['limit'] = parameters['limit'];
        }

        if (parameters['offset'] !== undefined) {
            queryParameters['offset'] = parameters['offset'];
        }

        if (parameters['orderBy'] !== undefined) {
            queryParameters['orderBy'] = parameters['orderBy'];
        }

        if (parameters['fields'] !== undefined) {
            queryParameters['fields'] = parameters['fields'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        request({
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            json: body,
            rejectUnauthorized: false
        }, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Get a discussion
     * @method
     * @name Discussion#getDiscussionsByDiscussionId
     * @param {{integer}} discussionId - Id of discussion
     * @param {{string}} fields - fields parameters to get partial response data
     *
     */
    this.getDiscussionsByDiscussionId = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var path = '/discussions/{discussionId}';

        var body;
        var queryParameters = {};
        var headers = {};

        path = path.replace('{discussionId}', parameters['discussionId']);

        if (parameters['discussionId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: discussionId'));
            return deferred.promise;
        }

        if (parameters['fields'] !== undefined) {
            queryParameters['fields'] = parameters['fields'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        request({
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            json: body,
            rejectUnauthorized: false
        }, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Create a Message
     * @method
     * @name Discussion#postDiscussionsByDiscussionIdMessages
     * @param {{integer}} discussionId - Id of discussion
     * @param {{}} body -
     *
     */
    this.postDiscussionsByDiscussionIdMessages = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var path = '/discussions/{discussionId}/messages';

        var body;
        var queryParameters = {};
        var headers = {};

        path = path.replace('{discussionId}', parameters['discussionId']);

        if (parameters['discussionId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: discussionId'));
            return deferred.promise;
        }

        if (parameters.body !== undefined) {
            body = parameters['body'];
        }

        if (parameters['body'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: body'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        request({
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            json: body,
            rejectUnauthorized: false
        }, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Get all messages for a discussion
     * @method
     * @name Discussion#getDiscussionsByDiscussionIdMessages
     * @param {{integer}} discussionId - Id of discussion
     * @param {{string}} fields - fields parameters to get partial response data
     *
     */
    this.getDiscussionsByDiscussionIdMessages = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var path = '/discussions/{discussionId}/messages';

        var body;
        var queryParameters = {};
        var headers = {};

        path = path.replace('{discussionId}', parameters['discussionId']);

        if (parameters['discussionId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: discussionId'));
            return deferred.promise;
        }

        if (parameters['fields'] !== undefined) {
            queryParameters['fields'] = parameters['fields'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        request({
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            json: body,
            rejectUnauthorized: false
        }, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Get a Message and it's children
     * @method
     * @name Discussion#getDiscussionsByDiscussionIdMessagesByMessageId
     * @param {{integer}} discussionId - Id of discussion
     * @param {{integer}} messageId - Id of message
     * @param {{string}} fields - fields parameters to get partial response data
     *
     */
    this.getDiscussionsByDiscussionIdMessagesByMessageId = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var path = '/discussions/{discussionId}/messages/{messageId}';

        var body;
        var queryParameters = {};
        var headers = {};

        path = path.replace('{discussionId}', parameters['discussionId']);

        if (parameters['discussionId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: discussionId'));
            return deferred.promise;
        }

        path = path.replace('{messageId}', parameters['messageId']);

        if (parameters['messageId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: messageId'));
            return deferred.promise;
        }

        if (parameters['fields'] !== undefined) {
            queryParameters['fields'] = parameters['fields'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        request({
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            json: body,
            rejectUnauthorized: false
        }, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Update a message
     * @method
     * @name Discussion#putDiscussionsByDiscussionIdMessagesByMessageId
     * @param {{integer}} discussionId - Id of discussion
     * @param {{integer}} messageId - Id of message
     * @param {{}} body -
     *
     */
    this.putDiscussionsByDiscussionIdMessagesByMessageId = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var path = '/discussions/{discussionId}/messages/{messageId}';

        var body;
        var queryParameters = {};
        var headers = {};

        path = path.replace('{discussionId}', parameters['discussionId']);

        if (parameters['discussionId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: discussionId'));
            return deferred.promise;
        }

        path = path.replace('{messageId}', parameters['messageId']);

        if (parameters['messageId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: messageId'));
            return deferred.promise;
        }

        if (parameters.body !== undefined) {
            body = parameters['body'];
        }

        if (parameters['body'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: body'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        request({
            method: 'PUT',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            json: body,
            rejectUnauthorized: false
        }, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Delete a messsage
     * @method
     * @name Discussion#deleteDiscussionsByDiscussionIdMessagesByMessageId
     * @param {{integer}} discussionId - Id of discussion
     * @param {{integer}} messageId - Id of message
     *
     */
    this.deleteDiscussionsByDiscussionIdMessagesByMessageId = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var path = '/discussions/{discussionId}/messages/{messageId}';

        var body;
        var queryParameters = {};
        var headers = {};

        path = path.replace('{discussionId}', parameters['discussionId']);

        if (parameters['discussionId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: discussionId'));
            return deferred.promise;
        }

        path = path.replace('{messageId}', parameters['messageId']);

        if (parameters['messageId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: messageId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        request({
            method: 'DELETE',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            json: body,
            rejectUnauthorized: false
        }, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Create a reply to a message.  The message ID path param will be used as the parent id for the message.
     * @method
     * @name Discussion#postDiscussionsByDiscussionIdMessagesByMessageIdMessages
     * @param {{integer}} discussionId - Id of discussion
     * @param {{integer}} messageId - Id of message
     * @param {{}} body -
     *
     */
    this.postDiscussionsByDiscussionIdMessagesByMessageIdMessages = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var path = '/discussions/{discussionId}/messages/{messageId}/messages';

        var body;
        var queryParameters = {};
        var headers = {};

        path = path.replace('{discussionId}', parameters['discussionId']);

        if (parameters['discussionId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: discussionId'));
            return deferred.promise;
        }

        path = path.replace('{messageId}', parameters['messageId']);

        if (parameters['messageId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: messageId'));
            return deferred.promise;
        }

        if (parameters.body !== undefined) {
            body = parameters['body'];
        }

        if (parameters['body'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: body'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        request({
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            json: body,
            rejectUnauthorized: false
        }, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Get the child messages for a message
     * @method
     * @name Discussion#getDiscussionsByDiscussionIdMessagesByMessageIdMessages
     * @param {{integer}} discussionId - Id of discussion
     * @param {{integer}} messageId - Id of message
     * @param {{string}} fields - fields parameters to get partial response data
     *
     */
    this.getDiscussionsByDiscussionIdMessagesByMessageIdMessages = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var path = '/discussions/{discussionId}/messages/{messageId}/messages';

        var body;
        var queryParameters = {};
        var headers = {};

        path = path.replace('{discussionId}', parameters['discussionId']);

        if (parameters['discussionId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: discussionId'));
            return deferred.promise;
        }

        path = path.replace('{messageId}', parameters['messageId']);

        if (parameters['messageId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: messageId'));
            return deferred.promise;
        }

        if (parameters['fields'] !== undefined) {
            queryParameters['fields'] = parameters['fields'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        request({
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            json: body,
            rejectUnauthorized: false
        }, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
};
