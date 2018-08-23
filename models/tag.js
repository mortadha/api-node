var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//admin shema
tagSchema = require('../schemas/tagShema.js')

var Tag = module.exports = mongoose.model('Tag',tagSchema)



//Add tag 
module.exports.addTag = function(tag,callback){
    Tag.create(tag,callback);
}

//Get all tag 
module.exports.getTags = function(type,callback,limit){
    Tag.find({type:type},callback).limit(limit);
}

//search tag

module.exports.findTags = function(text,type,callback){
    Tag.find({text: { $regex: '.*' + text + '.*' } })
    .where({type: type}).exec(callback);;
}