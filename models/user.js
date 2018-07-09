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

//my profil
module.exports.myProfil = function(id,callback){
    User.findOne({_id: id}
        , callback)
}


//my profil
module.exports.updateMyProfil = function(id,profil,callback){
    console.log(profil);
    console.log(id);
    User.updateOne({_id: id}, {name: profil.name,prenon:profil.prenon,phone: profil.phone,email:profil.email,pseudo:profil.pseudo}, {multi: true}
        , callback)
}