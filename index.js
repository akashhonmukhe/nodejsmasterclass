var http = require('http')
var url = require('url')
var lib = require('./lib/data')
var config = require('./lib/config')
var handlers = require('./lib/handlers')
var helpers = require('./lib/helpers')
var StringDecoder = require('string_decoder').StringDecoder


var httpServer = http.createServer(function(req, res){
    
    var parsedUrl = url.parse(req.url, true)
   
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');
    var queryStringObj = parsedUrl.query;

    //Get method of request
    var method = req.method.toLowerCase();
   
    //Get headers from request
    var headers = req.headers;
   
    //Get Payload if Any
    var decoder = new StringDecoder('utf-8');
    var buffer = '';

    req.on('data', function(data){
        
        buffer += decoder.write(data);
        //console.log(buffer)
    });

    req.on('end', function(){
        buffer += decoder.end();
        
        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath]:handlers.notfound(res)
        var reqData = {
            "path":trimmedPath,
            "queryStringObj":queryStringObj,
            "method":method,
            "headers":headers,
            "payload":helpers.convJsonToObject(buffer) 
    
        }
    
        chosenHandler(reqData, function(statusCode, payload){
            statusCode = typeof(statusCode) === 'number' ? statusCode : 200
            payload = typeof(payload) === 'object'? payload : {}
    
            var payloadString = JSON.stringify(payload)
    
            res.writeHead(statusCode)
            res.end(payloadString)
        })
    });

})


httpServer.listen(config.port, function(){
    console.log('Connected to port '+config.port)
})


var router = {
    "users": handlers.users,
    "notfound":handlers.notfound
}

