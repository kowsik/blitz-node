var testServerPort = 9295,
    sprint = require('../../lib/blitz/sprint'),
    credentials = {username: 'user', apiKey: 'key', host: 'localhost', port: 9295};

describe("Sprint", function () {
    it("should have a Result object", function () {
        var finished = false;
        runs (function() {
            sprint.create(credentials, {
                steps: [{url: 'http://127.0.0.1'}]
            }, function (err, data) {
                expect(data.region).toBeDefined();
                expect(data.duration).toBeDefined();
                expect(data.steps).toBeDefined();
                finished = true;
            }).execute();
        });
        waitsFor(function () {
            return finished;
        });
    });

    it("should have a Steps inside Result", function () {
        var finished = false;
        runs (function() {
            sprint.create(credentials, {
                steps: [{url: 'http://127.0.0.1'}]
            }, function (err, data) {
                var step = data.steps[0];
                expect(step.duration).toBeDefined();
                expect(step.connect).toBeDefined();
                expect(step.request).toBeDefined();
                expect(step.response).toBeDefined();
                finished = true;
            }).execute();
        });
        waitsFor(function () {
            return finished;
        });
    });

    it("should have a Request object inside Step", function () {
        var finished = false;
        runs (function() {
            sprint.create(credentials, {
                steps: [{url: 'http://127.0.0.1'}]
            }, function (err, data) {
                var request = data.steps[0].request;
                expect(request.line).toBeDefined();
                expect(request.method).toBeDefined();
                expect(request.url).toBeDefined();
                expect(request.headers).toBeDefined();
                expect(request.content).toBeDefined();
                finished = true;
            }).execute();
        });
        waitsFor(function () {
            return finished;
        });
    });

    it("should have a Response object inside Step", function () {
        var finished = false;
        runs (function() {
            sprint.create(credentials, {
                steps: [{url: 'http://127.0.0.1'}]
            }, function (err, data) {
                var response = data.steps[0].response;
                expect(response.line).toBeDefined();
                expect(response.message).toBeDefined();
                expect(response.status).toBeDefined();
                expect(response.headers).toBeDefined();
                expect(response.content).toBeDefined();
                finished = true;
            }).execute();
        });
        waitsFor(function () {
            return finished;
        });
    });

    it("should match the expected Result data", function () {
        var finished = false;
        runs (function() {
            sprint.create(credentials, {
                steps: [{url: 'http://127.0.0.1'}]
            }, function (err, data) {
                expect(data.region).toEqual('california');
                expect(data.duration).toEqual(10);
                expect(data.steps.length).toEqual(2);
                finished = true;
            }).execute();
        });
        waitsFor(function () {
            return finished;
        });
    });
    
    it("should match the expected Step data", function () {
        var finished = false;
        runs (function() {
            sprint.create(credentials, {
                steps: [{url: 'http://127.0.0.1'}]
            }, function (err, data) {
                var step = data.steps[0];
                expect(step.connect).toEqual(1);
                expect(step.duration).toEqual(5);
                expect(step.request).toBeDefined();
                expect(step.response).toBeDefined();
                finished = true;
            }).execute();
        });
        waitsFor(function () {
            return finished;
        });
    });

    it("should match the expected Request data", function () {
        var finished = false;
        runs (function() {
            sprint.create(credentials, {
                steps: [{url: 'http://127.0.0.1'}]
            }, function (err, data) {
                var request = data.steps[0].request;
                expect(request.method).toEqual('GET');
                expect(request.url).toEqual('http://localhost:9295');
                expect(request.content).toEqual('content');
                finished = true;
            }).execute();
        });
        waitsFor(function () {
            return finished;
        });
    });

    it("should match the expected Response data", function () {
        var finished = false;
        runs (function() {
            sprint.create(credentials, {
                steps: [{url: 'http://127.0.0.1'}]
            }, function (err, data) {
                var response = data.steps[0].response;
                expect(response.message).toEqual('message');
                expect(response.status).toEqual(200);
                expect(response.content).toEqual('content');
                finished = true;
            }).execute();
        });
        waitsFor(function () {
            return finished;
        });
    });
    
    it("should receive the result while running", function () {
        var finished = false;
        runs (function() {
            sprint.create(credentials, {
                user: 'b123',
                steps: [{url: 'http://127.0.0.1'}]
            }, function (err, data) {
                var response = data.steps[0].response;
                expect(response.status).toEqual(200);
                finished = true;
            }).execute();
        });
        waitsFor(function () {
            return finished;
        });
    });
});
