var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//admin shema
fflokSchema = require('../schemas/fflokShema.js')

var Fflok = module.exports = mongoose.model('Fflok',fflokSchema)

//Add fflok 
module.exports.createFFlok = function(fflok,callback){
    Fflok.create(fflok,callback);
 }

 //update places fflok 
module.exports.updatePlacesFFlok = function(idfflok,places,titre,callback){
    Fflok.findOneAndUpdate({_id: idfflok}, {$set:{titre:titre}, $push:{places:places}}, callback)
    .populate('friends.id')
    .populate('create_by');
 }

 //get information fflok
 module.exports.getFFlok = function(idfflok,callback){
    Fflok.
    findOne({_id: idfflok}, callback).
    populate({   
        path: 'friends.id',
        select :'name path_img phone place'
    })
    .populate('places.id')
    .populate('create_by')
    .populate('messages');
 }

 //acept fflok
 module.exports.aceptFFlok = function(idfflok,idUser,callback){
     Fflok.findOneAndUpdate(
        { "_id": idfflok, "friends.id": idUser },
        { 
            "$set": {
                "friends.$.acepte": true
            }
        },
        callback
    );
 }


 //leave fflok
 module.exports.leaveFFlok = function(idfflok,idUser,callback){
    Fflok.findOneAndUpdate(
       { "_id": idfflok, "friends._id": idUser },
       { 
           "$set": {
               "friends.$.acepte": false
           }
       },
       callback
   );
}

 //vote fflok
 module.exports.voteFFlok = function(idfflok,idUser,idPlace,callback){
     Fflok.findOneAndUpdate(
       { "_id": idfflok, "friends.id": idUser },
       { 
           "$set": {
               "friends.$.vote": true,
               "friends.$.place": idPlace
           }
       },
       callback
        ).populate(
        {   
            path: 'friends.id',
        //  match:{'id':{$nin: [{id:'4564564'}]}},
            select :'name path_img phone place'
            })
            .populate('places.id')
            .populate('create_by');
}

 //decision FFlok
 module.exports.decisionFFlok = function(idfflok,idPlace,callback){
     Fflok.findOneAndUpdate(
       { "_id": idfflok },
       { 
           "$set": {
               "final_Place": idPlace
           }
       },
       callback
   ).populate('final_Place');
}


 //get position fflok user
 module.exports.getPositionFFlokUser = function(idfflok,callback){
    Fflok.
    findOne({_id: idfflok}, callback).
    populate(
    {   
        path: 'friends.id',
    }).populate('final_Place')
    .populate('create_by');
  }

 //add Pictures fflok
  module.exports.addPicturesfflok = function(idfflok, idUser ,path_image,callback){
    var data = {
        uploaded_by: idUser,
        path_image: path_image,
         date: Date.now(),
     };
     Fflok.update({_id: idfflok}, {$push:{images:data}}, callback)
 }

 //add message fflok
 module.exports.addMessagefflok = function(idfflok, idUser ,message,callback){
    var data = {
        uploaded_by: idUser,
        text: message,
         date: Date.now(),
     };
     Fflok.update({_id: idfflok}, {$push:{messages:data}}, callback)
 }
 

 //count fflok 
module.exports.coutfflok = function(callback){
    Fflok.count()
     .exec(callback);
 }