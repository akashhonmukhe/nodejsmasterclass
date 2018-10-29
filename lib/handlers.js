var datalib = require('./data');
var helpers = require('./helpers')
var handlers = {};

handlers.users = function(data, callback){
    var acceptedMethods = ['get','post','put','delete'];
    
    if(acceptedMethods.indexOf(data.method) > -1){
        handlers._users[data.method](data,callback);
    }else{
        //Method Not Allowed
        callback(405);
    }
}

handlers._users = {};

handlers._users.post = function(data,callback){
    //console.log(data)
    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false
    var agreement = typeof(data.payload.agreement) == 'boolean' && data.payload.agreement ? data.payload.agreement : false


    if(firstName && lastName && password && agreement && phone){
        datalib.read('users',phone, function(err,data){
            if(err){
                var hashPassword = helpers.hashStr(password);

                if(hashPassword){
                    var userObj = {
                        firstName:firstName,
                        lastName:lastName,
                        phone:phone,
                        password:hashPassword,
                        agreement:true
                    }
    
                    datalib.create('users', phone, userObj, function(err){
                        if(!err){
                            callback(200)
                        }else{
                            callback(500, {"Error":"Unable to create user"+ err})
                        }
                    })
                }else{
                    callback(400, {"Error":"Error Occured"})
                }
            }else{
                callback(400, {"Error":"User with phone number already exixts"})
            }
        })
    }else{
        callback(400, {"Error":"Missing Required Field"})
    }
}

handlers._users.get = function(data,callback){
    var phone = typeof(data.queryStringObj.phone) == 'string' && data.queryStringObj.phone.trim().length == 10 ? data.queryStringObj.phone.trim() : false

    if(phone){
        datalib.read('users', phone, function(err,data){
            
            if(!err && data){
                delete data.password
                callback(200, data)
            }else{
                callback(500,{"Error":"Internal server error"+ err})
            }
        })
    }else{
        callback(500, {"Error":"Missing required parameter"})
    }
}

handlers._users.put = function(data,callback){
    var userData={}
    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false

    if(phone){
        if(firstName || lastName || password){
            if(firstName){
                userData.firstName = firstName
            }
            if(lastName){
                userData.lastName = lastName
            }
            if(password){
                userData.password = helpers.hashStr(password)
            }

            datalib.update('users', phone, userData, function(err){
                if(!err){
                    callback(200,{"Sucess":"Data Updated Successfully"})
                }else{
                    callback(500, {"Error":"Internal Server Error"})
                }
            })
        }else{
            callback(400, {"Error":"Missing Required Parameters"})
        }
    }else{
        callback(400, {"Error":"Invalid Parameter"})
    }

}

handlers._users.delete = function(data,callback){
    var phone = typeof(data.queryStringObj.phone) == 'string' && data.queryStringObj.phone.trim().length == 10 ? data.queryStringObj.phone.trim() : false

    if(phone){
        datalib.read('users', phone, function(err,data){
            
            if(!err && data){
                datalib.delete('users', phone, function(err){
                    if(!err){
                        callback(200)
                    }else{
                        callback(500,{"Error":"Unable to delete user"})
                    }
                })
            }else{
                callback(400,{"Error":"Unable to find specified user"})
            }
        })
    }else{
        callback(400, {"Error":"Missing required parameter"})
    }
}

handlers.notfound = function(data, callback){
   callback(404, {"Error":"Url not found"}) 
}

module.exports = handlers