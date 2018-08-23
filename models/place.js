var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//admin shema
adminSchema = require('../schemas/placeShema.js')

var Place = module.exports = mongoose.model('Place',placeSchema)


//Add place 
module.exports.addPlace = function(place,callback){
   Place.create(place,callback);
}

//delete place 
module.exports.deletePlace = function(id,callback){
    Place.deleteOne({ _id: id },callback);
}

//get one place 
module.exports.getPlace = function(id,callback){
    Place.findOne({ _id: id },callback);
}

//get one place 
module.exports.getPlaceIdGoogle = function(id,callback){
    Place.findOne({ id_google: id },callback);
}

//get all place
module.exports.getPlaces = function(callback,limit){
    Place.find(callback).limit(limit);
}


//get Proximite place
module.exports.GetProximitePlace = function( lat, lng ,callback){
    var distance = 5000 / 6371;
    Place.find({'geo': {$near: [ lat,lng],$maxDistance: distance} })
    .sort({'premium': -1})
    .limit(4)
    .exec(callback);
}

//get Proximite place Explorer
module.exports.GetProximitePlaceExplorer = function( lat, lng ,callback){
    var distance = 500 / 6371;
    Place.find({'geo': {$near: [ lat,lng],$maxDistance: distance} })
    .sort({'premium': -1})
    .exec(callback);
}


//count place 
module.exports.coutPlace = function(callback){
   Place.count()
    .exec(callback);
}

//login place 
module.exports.loginPlace = function(login,password,callback){
    Place.findOne({login: login,password:password}, callback)
}

//update status place
module.exports.updateStatus = function(login,statut,callback){
    Place.findOneAndUpdate({login: login}, {$set:{statut:statut}}, {new: true}, callback)
}

//add  tag place 
module.exports.addTagPlace = function(login,text,callback){
    var data = {
         text: text,
    };
     Place.update({login: login}, {$push:{tags:data}}, callback)
 }

 //add  tag place 
module.exports.deleteTagPlace = function(login,text,callback){
    var data = {
         text: text,
     };
     Place.update({login: login}, {$pull:{tags:data}}, callback)
 }

 //add  message place 
module.exports.addMessagePlace = function(login,text,callback){
    var data = {
        text: text,
    };
    Place.update({login: login}, {$push:{messages:data}}, callback);
}
// Get mesage
module.exports.getMessageByText = function(login,text,callback){
    Place.findOne({login: login,'messages.text':text}).select({ "messages.visible":1, "messages.text":1}).exec(callback);
    //Place.find({ login: login}).where('messages.text').equals(text).limit(1).select('messages.text messages.visible').exec(callback);
} 
// Edit message
module.exports.updateStatusMessage = function(login,text,visible,callback){
    Place.findOneAndUpdate({login: login,'messages.text':text}, {$set:{'messages.$.visible':visible}}, {new: true}, callback) 
}
// Add photo
module.exports.addPictures = function(login,position,path_image,callback){
    var data = {
        position: position,
        path: path_image,
        //date: Date.now(),
    };
    Place.update({login: login}, {$push:{images:data}}, callback)
}
// Delete photo
module.exports.deletePicture = function(login,fileName,callback){
    var data = {
        path: fileName,
    };
    Place.update({login: login}, {$pull:{images:data}}, callback);
}
// Add +1 to filed wins for place
module.exports.placeWin = function(idPlace,callback){
    Place.update({_id: idPlace}, {$inc:{wins:1}}, callback);
}
 
