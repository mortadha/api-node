var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//user shema
userSchema = require('../schemas/user.js')

var User = module.exports = mongoose.model('User',userSchema)

//Add user 
module.exports.addUser = function(user,callback){
    User.create(user,callback);
}


//login user 
module.exports.login = function(login,callback){
    User.find({'pseudo': login}
        , callback)
}
