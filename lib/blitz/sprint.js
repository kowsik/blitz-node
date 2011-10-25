(function() {

    var api = require('./api'),
        Validate = require('./validate'),
        sprint = {};
    
    /**
     * Request object returned by the sprint
     */
    function Request(json) {
        return {
            line: json['line'],
            method: json['method'],
            url: json['url'],
            headers: json['headers'],
            content: new Buffer(json['content'], 'base64').toString('utf8')
        };
    }

    /**
     * Response object returned by the sprint
     */
    function Response(json) {
        return {
            line: json['line'],
            status: json['status'],
            message: json['message'],
            headers: json['headers'], 
            content: new Buffer(json['content'], 'base64').toString('utf8')
        };
    }
    
    function Step(json) {
        var step = {
                connect: json['connect'],
                duration: json['duration']
            },
            request = json['request'],
            response = json['response'];
        if (request) {
            step.request = Request(request);
        }
        if (response) {
            step.response = Response(response);
        }
        return step;
    }

    /**
     * Result of the sprint
     */
    function Result(json) {
        var result = json['result'],
            steps = result['steps'].map(function (item) {
                return Step(item);
            });
        return {
            region: result['region'],
            duration: result['duration'],
            steps: steps
        };
    }


    /**
     * Responsable for the Sprints. Uses api.client to make the requests and return a
     * formatted Sprint response
     */
    sprint.create = function (credentials, options, callback) {
        var user = credentials.username,
            pass = credentials.apiKey,
            host = credentials.host,
            port = credentials.port,
            client = api.client(user, pass, host, port);
            
        return {
            execute: function () {
                var attributes = Validate(options);
                if (!attributes.valid()) {
                    throw attributes.result();
                }
                else {
                    client.execute(options, function (queueResponse) {
                        if (queueResponse.ok) {
                            var jobId = queueResponse.job_id,
                                intervalId = setInterval(function () {
                                    client.jobStatus(jobId, function (job) {
                                        var result = job.result;
                                        if (job.status === 'queued' || 
                                                (job.status === 'running' && !result)) {
                                            // if waiting or still running, wait 2 secs.    
                                            return;
                                        }
                                        else if (result && result.error) {
                                            // return an error if got an error from the escale engine
                                            callback(result.error, result);
                                            return;
                                        }
                                        else if (job.error) {
                                            // return an error if got an error from the server
                                            callback(job.error, result);
                                            return;
                                        }
                                        else if (!result) {
                                            // got here without any errors and result?
                                            throw "No Result";
                                        }
                                        if (job.status === 'completed') {
                                            // if we got here we can clear the interval
                                            clearInterval(intervalId);
                                        }
                                        // we finally call the callback
                                        callback(null, Result(job));
                                    });
                                }, 2000);
                        }
                        else {
                            callback(queueResponse.error, queueResponse);
                        }
                    });
                }
            },
            abort: function () {
                client.abort(jobId, function (response) {
                    if(response.error) {
                        callback(response.error, response);
                        return;
                    }
                    callback(null, JSON.stringify({ok:true}));
                });
            }
        };
    }
    
    module.exports = sprint;
}());