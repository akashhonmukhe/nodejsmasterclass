var http = require('http')
var url = require('url')

var httpServer = http.createServer(function(req, res){
    //res.end('Hello World')
})

httpServer.listen(3000, function(){
    console.log('Connected to port 4000')
})