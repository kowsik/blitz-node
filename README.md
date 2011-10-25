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
var Blitz = require('blitz');

console.log('Starting Sprint...');
Blitz('<email>','<api-key>').sprint({
    steps: [
        {url: 'http://your.cool.app'},
        {url: 'http://your.cool.ap/page1'}
    ],
    region: 'california'}, function (err, data) {
        if(err != null) {
            console.log(err);
            return;
        }
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
    });
```

**Rush**

```javascript
var Blitz = require('blitz');

console.log('Starting Rush...');
Blitz('<email>','<api-key>').rush({
    steps: [
        {url: 'http://your.cool.app'},
        {url: 'http://your.cool.ap/page1'}
    ],
    region: 'california',
    pattern: { intervals: [{start: 1, end: 10, duration: 30}]}
}, function (err, data) {
        if(err != null) {
            console.log(err);
            return;
        }
        console.log('timeline: [');
        var timeline = data.timeline;
        for(var i in timeline) {
            console.log('total: ' + timeline[i].total + ', errors: '+ timeline[i].errors);
            var steps = timeline[i].steps;
            for(var j in steps) {
                console.log("\t\t{step "+ j + " duration: " + steps[j].duration + "}");
            }
        }
        console.log(']');
    });
```