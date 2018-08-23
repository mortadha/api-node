var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//admin shema
adminSchema = require('../schemas/adminShema.js')

var Admin = module.exports = mongoose.model('Admin',adminSchema)



//Add admin 
module.exports.addAdmin = function(admin,callback){
    Admin.create(admin,callback);
}

//Get admin 
module.exports.getAdmin = function(email,password,callback){
    Admin.find({email: email,password:password}, callback)
}


//existAdmin
module.exports.existAdmin = function(email,callback){
    Admin.find({email: email}, callback)
}


//Get Admis 
module.exports.getAdmins = function(callback,limit){
    Admin.find(callback).limit(limit);
}