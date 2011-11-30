### ![blitz.io](http://blitz.io/images/logo2.png)

### Make load and performance a fun sport.

* Run a sprint from around the world
* Rush your API and website to scale it out
* Condition your site around the clock

## Getting started

Login to [blitz.io](http://blitz.io) and in the blitz bar type:
    
    --api-key

Now

    npm install blitz

Then

**Sprint**

```javascript
var Blitz = require('../blitz-node/lib/blitz.js');

console.log('Starting Sprint...');
new Blitz('<email>','<api-key>').sprint({
    steps: [
        {url: 'http://your.cool.app'},
        {url: 'http://your.cool.ap/page1'}
    ],
	region: 'california'
}).on('status', function (data) {
    process.stdout.write('.');
}).on('complete', function (data) {
    console.log('region: ' + data.region);
    console.log('duration: ' + data.duration);
    var steps = data.steps;
    for(var i in steps) {
        var step = steps[i];
        console.log("> Step " + i);
        console.log("\tstatus: " + step.response.status);
        console.log("\tduration: " + step.duration);
        console.log("\tconnect: " + step.connect);
    }
}).on('error', function (response) {
    console.log("error: " + response.error);	
    console.log("reason: " + response.reason);
});
```

**Rush**

```javascript
var Blitz = require('blitz');

console.log('Starting Rush...');
new Blitz('<email>','<api-key>').rush({
    steps: [
        {url: 'http://your.cool.app'},
        {url: 'http://your.cool.ap/page1'}
    ],
    region: 'california',
    pattern: { intervals: [{start: 1, end: 10, duration: 30}]}
}).on('status', function (data) {
    process.stdout.write('.');
}).on('complete', function (data) {
    console.log('region: ' + data.region);
    console.log('duration: ' + data.duration);
    var steps = data.steps;
    for(var i in steps) {
        var step = steps[i];
        console.log("> Step " + i);
        console.log("\tstatus: " + step.response.status);
        console.log("\tduration: " + step.duration);
        console.log("\tconnect: " + step.connect);
    }
}).on('error', function (response) {
    console.log("error: " + response.error);	
    console.log("reason: " + response.reason);
});
```

**Easy Method**

If you don't want to pass in JSON and would like to stick to the command-line
interface that's available on [blitz.io](http://blitz.io), you can also do the
following. Depending on whether you specify the `pattern`, the callbacks will
get either sprint results or rush results.

```javascript
var Blitz = require('blitz');

console.log('Starting Rush...');
new Blitz('<email>','<api-key>').execute('-r california -p 1-250:50 http://test.blitz.io')
    .on('status', function (data) {
        process.stdout.write('.');
    })
    .on('complete', function (data) {
        console.log('region: ' + data.region);
        console.log('duration: ' + data.duration);
        var steps = data.steps;
        for(var i in steps) {
            var step = steps[i];
            console.log("> Step " + i);
            console.log("\tstatus: " + step.response.status);
            console.log("\tduration: " + step.duration);
            console.log("\tconnect: " + step.connect);
        }
    })
    .on('error', function (response) {
        console.log("error: " + response.error);	
        console.log("reason: " + response.reason);
    });
````