var testServerPort = 9295,
    Blitz = require('../lib/blitz.js');

//needed by the mock server to compare usernames
process.env['BLITZ_API_USER'] = 'user';

describe("Blitz", function () {
    it("should return a Rush Result object", function () {
        var finished = false;
        runs (function() {
            Blitz('user', 'key', 'localhost', 9295)
                .rush({
                    user: 'c123',
                    pattern: { intervals: []},
                    steps: [
                        {url: 'http://127.0.0.1'},
                        {url: 'http://127.0.0.1/2'}
                    ]
                }, function (err, data) {
                expect(data.region).toBeDefined();
                expect(data.timeline).toBeDefined();
                expect(data.timeline[0].steps).toBeDefined();
                expect(data.timeline[0].steps.length).toEqual(2);
                finished = true;
            });
        });
        waitsFor(function () {
            return finished;
        });
    });

    it("should return a Sprint Result object", function () {
        var finished = false;
        runs (function() {
            Blitz('user', 'key', 'localhost', 9295)
                .sprint({
                    steps: [
                        {url: 'http://127.0.0.1'},
                        {url: 'http://127.0.0.1/2'}
                    ]
                }, function (err, data) {
                    expect(data.region).toBeDefined();
                    expect(data.duration).toBeDefined();
                    expect(data.steps).toBeDefined();
                    expect(data.steps.length).toEqual(2);
                    finished = true;
                });
        });
        waitsFor(function () {
            return finished;
        });
    });

    it("should fail Rush if pattern is not given", function () {
        var b = Blitz('user', 'key', 'localhost', 9295),
            finished = false;
        // run a sprint to authenticate
        runs (function () {
            b.sprint({
                steps: [
                    {url: 'http://127.0.0.1'},
                    {url: 'http://127.0.0.1/2'}
                ]
            }, function (err, data) {
                //now we can run a rush
                expect(function () {
                    b.rush({
                        user: 'c123',
                        steps: [{url: 'http://127.0.0.1'}] 
                    }, function (err, data) {});  
                }).toThrow('missing pattern');
                finished = true;
            });
        });
        waitsFor (function() {
            return finished;
        });
    });
});
