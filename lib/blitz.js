(function () {

    var api = require('./blitz/api'),
        Sprint = require('./blitz/sprint'),
        Rush = require('./blitz/rush');
        
    function Blitz (username, apiKey, host, port, apiAuthenticated) {
        var self = this;
        self.authenticated = apiAuthenticated || false,
        self.credentials = {
            username: username,
            apiKey: apiKey,
            host: host,
            port: port
        }; 
        
        function run(options, module) {
            //verifies authentication
            if(self.authenticated) {
                module.create(self.credentials, options).execute();
            }
            else {
                var client = new api.Client(username, apiKey, host, port);
                client.login().on('login', function(result) {
                    if (result.ok) {
                        self.authenticated = true;
                        self.credentials.apiKey = result.api_key;
                        module.create(self.credentials, options).execute();
                    }
                    else {
                        module.emit('error', result);
                    }
                }).on('error', function (response) {
                    //propagates the api error thorugh the module
                    module.emit('error', response);
                });
            }
        }
        
        self.rush = function (options) {
            var rush = new Rush();
            run(options, rush);
            return rush;
        }
        
        self.sprint = function(options) {
            var sprint = new Sprint();
            run(options, sprint);
            return sprint;
        }
    }
    
    module.exports = Blitz;
}());
