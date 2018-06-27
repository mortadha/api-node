var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//user shema
categorieSchema = require('../schemas/categorie.js')

var Categorie = module.exports = mongoose.model('Categorie',categorieSchema)

//Add user 
module.exports.addUser = function(categorie,callback){
    Categorie.create(categorie,callback);
}


