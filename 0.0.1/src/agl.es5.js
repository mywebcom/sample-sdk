'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var http = require('http'),
    querystring = require('querystring');

var AGL = function () {
    /**
     * initialize AGL and set default value and error handling
     * @param params
     */
    function AGL(params) {
        _classCallCheck(this, AGL);

        this.appKey = params.appKey;
        this.appSecret = params.appSecret;
        this.token = params.token || '';
        this.consumerKey = params.consumerKey || null;
        this.timeout = params.timeout;

        this.host = params.host || 'agl-developer-test.azurewebsites.net';
        this.port = params.port || 80;
        this.basePath = params.basePath || '/';
    }

    /**
     * Execute a request on the API
     *
     * @param {String} httpMethod: The HTTP method
     * @param {String} path: The request path
     * @param {Object} params: The request parameters (passed as query string or
     *                         body params)
     * @param {Object} refer: The parent proxied object
     */


    _createClass(AGL, [{
        key: 'request',
        value: function request(httpMethod, path, params, refer) {
            var _this = this;

            return new Promise(function (resolve, reject) {
                // Replace "{str}", used for $call()
                if (path.indexOf('{') >= 0) {
                    var newPath = path;

                    for (var paramKey in params) {
                        if (params.hasOwnProperty(paramKey)) {
                            newPath = path.replace('{' + paramKey + '}', params[paramKey]);

                            // Remove from body parameters
                            if (newPath !== path) {
                                delete params[paramKey];
                            }

                            path = newPath;
                        }
                    }
                }

                var options = {
                    host: _this.host,
                    port: _this.port,
                    method: httpMethod,
                    path: _this.basePath + path
                };

                // Headers
                options.headers = {
                    'Content-Type': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
                    'Accept': '*/*'
                };

                // Remove undefined values
                for (var k in params) {
                    if (params.hasOwnProperty(k) && params[k] == null) {
                        delete params[k];
                    }
                }

                var reqBody = null;
                if ((typeof params === 'undefined' ? 'undefined' : _typeof(params)) === 'object' && Object.keys(params).length > 0) {
                    if (httpMethod === 'PUT' || httpMethod === 'POST') {
                        // Escape unicode
                        reqBody = JSON.stringify(params).replace(/[\u0080-\uFFFF]/g, function (m) {
                            return '\\u' + ('0000' + m.charCodeAt(0).toString(16)).slice(-4);
                        });
                        options.headers['Content-Length'] = reqBody.length;
                    } else {
                        options.path += '?' + querystring.stringify(params);
                    }
                }

                if (path.indexOf('/login') < 0) {
                    // Sign request
                    if (typeof _this.consumerKey === 'string') {}
                }

                var req = http.request(options, function (res) {
                    var body = '';

                    res.on('data', function (chunk) {
                        return body += chunk;
                    });

                    res.on('end', function () {
                        var response = void 0;

                        if (body.length > 0) {
                            try {
                                response = JSON.parse(body);
                            } catch (e) {
                                return reject('[AGL] Unable to parse JSON reponse');
                            }
                        } else {
                            response = null;
                        }
                        resolve(response);
                    });
                });

                // istanbul ignore next
                req.on('error', function (e) {
                    return reject(e.errno || e.body);
                });

                // istanbul ignore next
                // mocked socket has no setTimeout
                if (typeof _this.timeout === 'number') {
                    req.on('socket', function (socket) {
                        socket.setTimeout(_this.timeout);
                        if (socket._events.timeout != null) {
                            socket.on('timeout', function () {
                                return req.abort();
                            });
                        }
                    });
                }

                if (reqBody != null) {
                    req.write(reqBody);
                }

                req.end();
            });
        }

        /**
         * get list of people and output a list of all the cats in alphabetical order under a heading of the gender of their owner
         */

    }, {
        key: 'fetch',
        value: function fetch() {
            return this.request('GET', 'people.json', {});
        }

        //@todo: method to sign request for better security for OAuth2

    }, {
        key: 'signRequest',
        value: function signRequest() {}
    }]);

    return AGL;
}();

module.exports = function (params) {
    return new AGL(params || {});
};
