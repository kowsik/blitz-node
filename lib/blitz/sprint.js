(function() {

    var api = require('./api'),
        EventEmitter = require('events').EventEmitter,
        Validate = require('./validate'),
        Sys = require('sys');
    
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
    
    /**
     * Represents a step in the transaction (even if there's only one). Each
     * step contains the request and response objects as well as the stats
     * associated with them.
     */
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

    function Sprint () {
        var self = this;
        
        /**
         * Responsable for the Sprints. Uses api.client to make the requests 
         * and return a formatted Sprint response
         */
        self.create = function (credentials, options) {
            var user = credentials.username,
                pass = credentials.apiKey,
                host = credentials.host,
                port = credentials.port,
                client = new api.Client(user, pass, host, port);

            return {
                execute: function () {
                    var attributes = Validate(options);
                    if (!attributes.valid()) {
                        throw attributes.result();
                    }
                    else {
                        client.on('queue', function (data) {
                            if (data.ok) {
                                var jobId = data.job_id;
                                //propagates the queue event from api
                                self.emit('queue', data);
                                //check api status
                                client.jobStatus(jobId).on('status', function (job) {
                                    var result = job.result,
                                        timeout = setTimeout(function () {
                                            client.jobStatus(jobId);
                                        }, 2000);
                                    if (job.status === 'queued' || 
                                            (job.status === 'running' && !result)) {
                                        //if waiting or still running, wait 2 secs.    
                                        return;
                                    }
                                    else if (result && result.error) {
                                        //return an error if got an error 
                                        //from the escale engine
                                        self.emit('error', result);
                                        return;
                                    }
                                    else if (job.error) {
                                        //return an error if got an error 
                                        //from the server
                                        self.emit('error', job);
                                        return;
                                    }
                                    else if (!result) {
                                        //got here without any errors and result?
                                        throw "No Result";
                                    }
                                    if (job.status === 'completed') {
                                        //if we got here we can clear the interval
                                        //and change the event we will emit
                                        self.emit('complete', Result(job));
                                        clearTimeout(timeout);
                                        return;
                                    }
                                    // we finally emit the status
                                    self.emit('status', Result(job));
                                });
                            }
                            else {
                                self.emit('error', data);
                            }
                        }).on('error', function (response) {
                            rush.emit('error', response);
                        }).execute(options);
                    }
                    return self;
                },
                abort: function (jobId) {
                    client.abort(jobId).on('abort', function (response) {
                        self.emit('abort', JSON.stringify({ok:true}));
                    }).on('error', function (response) {
                        self.emit('error', response);
                    });
                    return self;
                }
            };
        }
    }
    
    Sys.inherits(Sprint, EventEmitter);
    
    module.exports = Sprint;
}());