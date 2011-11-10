/*jslint
    onevar: false, undef: true, newcap: true, nomen: false, es5: true,
    regexp: true, plusplus: true, bitwise: true, browser: true, indent: 4 */
/*global require, module, console, process */
/**
 * Responsable for requests to Blitz RESTful API
 */
(function () {
    var http = require('http'),
        EventEmitter = require('events').EventEmitter,
        Sys = require('sys'),
        api = {};

    api.Client = function (user, apiKey, host, port) {
        var self = this;
        
        function requestOptions() {
            return {
                host: host || 'blitz.io',
                port: port || 80,
                method: 'POST',
                headers: {
                    'X-API-User': user,
                    'X-API-Key': apiKey,
                    'X-API-Client' : 'node'
                }
            };
        }
        
        function responseHandler(response, callback) {
            // return error if not successful
            if (response.statusCode !== 200) {
                self.emit('error', {
                    error: 'server', 
                    cause: response.statusCode
                });
                return;
            }
            // puts the data together
            var responseText = '';
            response.on('data', function (chunk) {
                responseText += chunk;
            });
            response.on('end', function () {
                // return error if no response from the server
                if (responseText === '') {
                    self.emit('error', {
                        error: 'server', 
                        reason: 'No response'
                    });
                    return;
                }
                // return the data received
                callback(JSON.parse(responseText));
            });
        }

        self.execute = function (data) {
            var request = null,
                jsonData = JSON.stringify(data),
                options = requestOptions();

            options.path = '/api/1/curl/execute';
            options.headers['content-length'] = jsonData.length;
            request = http.request(options, function (response) {
                responseHandler(response, function (jsonData) {
                    // only emmited on complete
                    var event = 'queue';
                    if (jsonData.error) {
                        event = 'error';
                    }
                    self.emit(event, jsonData);
                });
            });
            // sends the data and closes the request
            request.write(jsonData);
            request.end();
            return self;
        };
        
        self.login = function () {
            var request = null,
                options = requestOptions();
            options.path = '/login/api';
            options.method = 'GET';
            request = http.request(options, function (response) {
                responseHandler(response, function (jsonData) {
                    // only emmited on complete
                    var event = 'login';
                    if (jsonData.error) {
                        event = 'error';
                    }
                    self.emit(event, jsonData);
                });
            });
            // closes the request
            request.end();
            return self;
        };
        
        self.jobStatus = function (jobId) {
            var request = null,
                options = requestOptions();
            options.path = '/api/1/jobs/' + jobId + '/status';
            options.method = 'GET';
            request = http.request(options, function (response) {
                responseHandler(response, function (jsonData) {
                    // only emmited on complete
                    var event = 'status';
                    if (jsonData.error) {
                        event = 'error';
                    }
                    self.emit(event, jsonData);
                });
            });
            // closes the request
            request.end();
            return self;
        };
        
        self.abort = function (jobId) {
            var request = null,
                options = requestOptions();
            options.path = '/api/1/jobs/' + jobId + '/abort';
            options.method = 'PUT';
            request = http.request(options, function (response) {
                responseHandler(response, function (jsonData) {
                    // only emmited on complete
                    var event = 'abort';
                    if (jsonData.error) {
                        event = 'error';
                    }
                    self.emit(event, jsonData);
                });
            });
            // closes the request
            request.end('');
            return self;
        };
        
        return self;
    };
    
    Sys.inherits(api.Client, EventEmitter);
    
    module.exports = api;
}());    
