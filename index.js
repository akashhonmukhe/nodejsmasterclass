var http = require('http')
var url = require('url')

var httpServer = http.createServer(function(req, res){
    res.write('Hey Buddy! Welcome to NodeJs Masterclass \n \n')
    var parsedUrl = url.parse(req.url, true)
   
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');
    var queryStringObj = parsedUrl.query;
    
    //checks for hello in url
    (trimmedPath.indexOf('hello') !== -1)?router['hello'](res,queryStringObj):router['notfound'](res)
})

httpServer.listen(3000, function(){
    console.log('Connected to port 3000')
})

var handler = {};

handler.hello = function(res, queryStringObj){  
    let welcomeMsg = {"message":"Welcome to NodeJs Master Class"}
    if(typeof queryStringObj !== 'undefined'){
        welcomeMsg = queryStringObj
    }
    res.end("Change or Pass query string parameters to get json obj \n\n"+JSON.stringify(welcomeMsg))
}

handler.notfound = function(res){
    res.end('You can start with /hello and pass querystring to get json object !!')
}

var router = {
    "hello": handler.hello,
    "notfound":handler.notfound
}

