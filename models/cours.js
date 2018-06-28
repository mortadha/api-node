var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//user shema
coursSchema = require('../schemas/cours.js')

var Cours = module.exports = mongoose.model('Cours',coursSchema)

//Add user 
module.exports.addCours = function(cours,callback){
    Cours.create(cours,callback);
}


//Get events 
module.exports.getCours = function(callback,limit){
    Cours.find(callback).limit(limit);
}

//Get My Cours 
module.exports.getMyCours = function(id,callback,limit){
    Cours.find({uploaded_by: id},callback).limit(limit);
}


//delete Cours 
module.exports.deleteCours = function(id,callback,limit){
    Cours.delete({_id: id},callback);
}


//search cour

module.exports.findTags = function(text,type,callback){
    Cours.find({categorie: { $regex: '.*' + text + '.*' } })
    .exec(callback);;
}