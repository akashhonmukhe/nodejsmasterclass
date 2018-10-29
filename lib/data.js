//Create, Update or Remove data files

var fs = require("fs")
var path = require("path")
var helpers = require("./helpers")

var lib = {}

lib.dataPath = path.resolve(__dirname,"./../.data")
// Create file

lib.create = function(dir,file,data,callback){
    let filePath = `${lib.dataPath}/${dir}/${file}.json`
    console.log(filePath)
    fs.open(filePath, 'wx', function(err, fileDescriptor){
        let stringData = JSON.stringify(data)
        if(!err && fileDescriptor){

            fs.write(fileDescriptor, stringData, function(err){
                if(!err){
                    fs.close(fileDescriptor, function(err){
                        if(!err){
                            callback(false)
                        }else{
                            callback('Error closing file')
                        }
                    })
                }else{
                    callback('Error writing to file')
                }
            })
        }else{
            callback('Error creating file. It may already exist')
        }
    })
}

lib.read = function(dir,file,callback){
    let filePath = `${lib.dataPath}/${dir}/${file}.json`
    fs.readFile(filePath, 'utf-8', function(err,data){
        if(!err && data){
            var parsedData = helpers.convJsonToObject(data)
            callback(false,parsedData)
        }else{
            callback(err,data)
        }
        
    })  
}

lib.update = function(dir, file, data, callback){
    let filePath = `${lib.dataPath}/${dir}/${file}.json`
    fs.open(filePath, 'r+', function(err,fileDescriptor){
        if(!err){
            fs.truncate(fileDescriptor,function(err){
                if(!err){   
                    let stringData = JSON.stringify(data)
                    fs.writeFile(fileDescriptor, stringData, function(err){
                        if(!err){
                            fs.close(fileDescriptor, function(err){
                                if(!err){
                                    callback(false)
                                }else{
                                    callback('Unable to close file')
                                }
                            })
                        }else{
                            callback('Unable to write data on file')
                        }
                    })
                }else{
                    callback('Unable to truncate the file')
                }
            })
        }else{
            callback('Could not read file. It might not exist')
        }
    })
}

lib.delete = function(dir, file, callback){
    let filePath = `${lib.dataPath}/${dir}/${file}.json`

    fs.unlink(filePath, function(err){
        if(!err){
            callback(false)
        }else{
            callback(err)
        }
    })
}

module.exports = lib

