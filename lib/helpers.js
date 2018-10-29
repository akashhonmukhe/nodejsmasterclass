var crypto = require('crypto')
var config = require('./config')

var helper = {}


helper.convJsonToObject = function(data){

    try{
        var parsedData = JSON.parse(data)
        return parsedData; 
    }catch(e){
        return {}
    }
   
}

helper.hashStr = function(str){
   if( typeof(str) === "string" && str.length > 0){
        var hash = crypto.createHmac('sha256',config.hashKey).update(str).digest('hex')
        return hash;
   }else{
       return false;
   }
}

module.exports = helper