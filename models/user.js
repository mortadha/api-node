var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var i18n = require('../services/locale.json');

//user shema
userSchema = require('../schemas/userShema.js')

var User = module.exports = mongoose.model('User',userSchema)

//Add user 
module.exports.addUser = function(user,callback){
    User.create(user,callback);
}

//delete all user 
module.exports.deleteAll = function(callback){
    User.remove({}, callback)
}

//update name user 
module.exports.updateNameUser = function(phone,prenom,callback){
    User.findOneAndUpdate({phone: phone}, {$set:{prenon:prenom}}, {new: true}, callback)
}

//check  code Sms 
module.exports.checkCodeSmsPhone = function(phone,code,registrationToken,latitude,longitude,callback){
  User.findOneAndUpdate({phone: phone,code: code},
        {$set:{
            registrationToken:registrationToken,
            active:true,
            latitude:latitude,
            longitude:longitude,
            geo:[latitude,longitude]
            },
         },
           {new: true},
            callback)
}





//update position 
module.exports.updatePosition = function(phone,latitude,longitude,callback){
    User.findOneAndUpdate(
        {phone: phone},{$set:{latitude:latitude,longitude:longitude,geo:[latitude,longitude]}} ,callback);
}

//update statu 
module.exports.updateStatu = function(phone,statu,callback){
    User.findOneAndUpdate({phone: phone},{$set:{statu:statu}}, {new: true}, callback)
}

//get my profil
module.exports.getMyProfil = function(phone,callback){
    User.findOne({phone: phone}, callback)
}

//get profil user
/*module.exports.getMyProfil = function(phone,callback){
    User.find({phone: phone})
    .select({ code: 1 })
    .exec(callback);
}*/

//Get users 
module.exports.getUsers = function(callback,limit){
    User.find(callback).limit(limit);
}

//check phone 
module.exports.checkCodeSms = function(phone,callback){
    User.find({phone: phone}, callback)
}

//update phone user 
module.exports.updateCodeUser = function(phone,code,callback){
    User.findOneAndUpdate({phone: phone}, {$set:{code:code}}, {new: true}, callback)
}

//update video user 
module.exports.updateVideoUser = function(phone,video,callback){
    User.findOneAndUpdate({phone: phone}, {$set:{path_video:video}}, {new: true}, callback)
}

//update img user 
module.exports.updateImageUser = function(phone,video,callback){
    User.findOneAndUpdate({phone: phone}, {$set:{path_img:video}}, {new: true}, callback)
}

//add new like user fflok 
module.exports.addNewFriend = function(phone,friend,callback){
   var data = {
        id: friend,
        like: true,
        date: Date.now(),
    };
   User.update({phone: phone}, {$push:{likers:data}}, callback)
}

//get my friends fflok
module.exports.GetFriends = function(phone,callback){
     User.
        findOne({phone: phone}, callback).
        populate('likers.id');
 }

 //get Proximite Friends
module.exports.GetProximitenoFriend = function(phones ,friendsOfFriends, lat, lng ,callback){
    var distance = 5000 / 6371;
    User.find({'geo': {$near: [ lat,lng],$maxDistance: distance}, _id:{$in: friendsOfFriends},'statu': true })
    .where({phone: {$nin: phones}})
    .limit(30)
    .exec(callback);
}

//get proximite Friends with aggregation
module.exports.GetProximiteFriend = function(phone , lat, lng ,callback){
    var distance = 5000/ 6371;
    User.findOne({phone: phone }).
    populate(
        {
            path: 'likers.id', 
            match: { 'geo': {$near: [ lat,lng],$maxDistance: distance},'statu': true},
            select: 'id path_img phone name likers.id',
        }
    
    )
    .exec(callback);
}
//get proximite Friends of friends
module.exports.GetProximiteFriendOfFriends = function(phone , lat, lng ,callback){
    var distance = 5000 / 6371;
    User.findOne({phone: phone }).
    populate(
        {
            path: 'likers.id', 
            match: { 'geo': {$near: [ lat,lng],$maxDistance: distance,'statu': true}},
            select: 'id path_img phone name'}
    
    ).exec(callback);
}


//test friend or no
module.exports.friendOrNo = function(phone , idFriend ,callback){
  User.find({ "phone": phone, "likers.id": idFriend },callback);
}

//add random friend
module.exports.randomFriend = function(phone ,callback){
    User.
    findOne({phone: phone}, callback).
    populate('likers.id');
  }

  //get chance fflok

module.exports.getchancefflok = function(id,callback){
    User.
       findOne({_id: id},'démocrate', callback);
}

//inc number fflok user

module.exports.addfflokToUser = function(idUser,idfflok,vote,acepte,create_by_me,callback){
    var data = {
        id: idfflok,
        vote: vote,
        acepte:acepte ,
        date : Date.now(),
        create_by_me : create_by_me

    };
    User.
    findOneAndUpdate({_id: idUser},{$push:{fflok:data}}, callback);
}

//update % démocrate 
module.exports.updateDémocrateUser = function(phone,démocrate,callback){
    User.findOneAndUpdate({phone: phone}, {$set:{démocrate:démocrate}}, {new: true}, callback)
}


// get a random user
module.exports.getRandomUser = function(phone,démocrate,callback){
    User.findOneAndUpdate({phone: phone}, {$set:{démocrate:démocrate}}, {new: true}, callback)
}

//get my friends fflok
module.exports.getAllMyfflok = function(phone,callback){
    User.
       findOne({phone: phone}, callback).
       populate('fflok.id');
}


//add  place user fflok 
module.exports.addFavoritePlace = function(phone,place,callback){
    var data = {
         id: place,
         like: true,
         date: Date.now(),
     };
    User.update({phone: phone}, {$push:{favorite_place:data}}, callback)
 }


 //check favorite place or no
module.exports.checkFavoritePlace = function(phone,place,callback){
    User.findOne({"phone": phone,"favorite_place.id":place })
    .exec(callback);
 }


  //match friend
  module.exports.matchFriend = function(phone,idFriend,callback){
    User.findOneAndUpdate(
       { "phone": phone, "likers.id": idFriend },
       { 
          $inc: { 'likers.$.score': +1 }
        },
       callback
   );
}



//check badge nouvelle recrue 

module.exports.checkBadgeCommunityBuilder = function(phone,CommunityBuilder,callback){
    var data = {
        name: CommunityBuilder,
        subtitle: '',
      //  date: Date.now(),
    };
    User.findOneAndUpdate({phone: phone,'badge.name': {$ne: CommunityBuilder}},
        {
            $addToSet:{badge:data}  
        },
           {new: true},
            callback)
}

//count place 
module.exports.coutUser = function(callback){
    User.count()
     .exec(callback);
 }