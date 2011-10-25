(function () {
    
    function Validate(json) {

        function url (url) {
            var expected = /^\w{3,6}:\/\/([\w-_]+\.)+[\w]{1,3}/gi
            return url != null && expected.test(url);
        }
        
        function integer(num) {
            var expected = /^\d+$/g
            return num != null && expected.test(num.toString(10));
        }
        
        function notEmpty(str) {
            return str != null && str.length > 0;
        }
        
        function array(array) {
            return array != null && Object.prototype.toString.apply(array) === '[object Array]';
        }
        
        function number(num) {
            return num != null && Object.prototype.toString.apply(num) === '[object Number]';
        }
        
        var failed =[];
        if(!array(json.steps)) {
            failed.push('steps');
        }
        else {
            for(var index in json.steps) {
                var step = json.steps[index];
                if(!url(step.url)) {
                    failed.push('url');
                }
                if(typeof step.cookies !== 'undefined' && !array(step.cookies)) {
                    failed.push('cookies');
                }
                if (typeof step.referer !== 'undefined'  && !url(step.referer)) {
                    failed.push('referer');
                }
                if (typeof step.headers !== 'undefined' && !array(step.headers)) {
                    failed.push('headers');
                }
                if(typeof step.content !== 'undefined' && !step.content.data) {
                    failed.push('content');
                }
                if(typeof step.status !== 'undefined' && !number(step.status) && !integer(step.status)) {
                    failed.push('status');
                }
                if(typeof step.timeout !== 'undefined' && !number(step.timeout) && !integer(step.timeout)) {
                    failed.push('timeout');
                }
                if(typeof step.user !== 'undefined' && !notEmpty(step.user)) {
                    failed.push('user');
                }
                if(typeof step.ssl !== 'undefined' && !notEmpty(step.ssl)) {
                    failed.push('ssl');
                }
            }
        }
        if(typeof json.pattern !== 'undefined' && !array(json.pattern.intervals)) {
            failed.push('pattern');
        }
        if(typeof json.region !== 'undefined' && !notEmpty(json.region)) {
            failed.push('region');
        }
        return {
            valid: function () {
                return failed.length === 0;
            },
            result: function () {
                if(failed.length === 0) {
                    return null;
                }
                return {
                    error: 'validation',
                    reason: 'invalid JSON attributes',
                    attributes: failed
                };
            }
            
        };
    }

    module.exports = Validate;
}());
