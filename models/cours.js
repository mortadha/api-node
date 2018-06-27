var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//user shema
coursSchema = require('../schemas/cours.js')

var Cours = module.exports = mongoose.model('Cours',coursSchema)

//Add user 
module.exports.addCours = function(cours,callback){
    Cours.create(cours,callback);
}
