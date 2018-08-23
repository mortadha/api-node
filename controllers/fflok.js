var express = require('express');
var bodyParser = require('body-parser');
ffloks = require('../models/fflok.js');
places = require('../models/place.js');
users = require('../models/user.js');
var jwtUtils= require('../services/jwt.utils');
var config = require('../config/config.js');
var octopush = require('octopush');
var i18n = require('../services/locale.json');
var fireBase = require('../services/fireBase');
var forEach = require('async-foreach').forEach;
var async = require("async");
var getJSON = require('get-json')
var ObjectId = require('mongodb').ObjectID;
var dateFormat = require('dateformat');
const fetch = require("node-fetch");
                    

module.exports = {
    ceratefflok: function(req,res){
        // Getting auth header
        var headerAuth  = req.headers['authorization'];
        var user        = jwtUtils.getUser(headerAuth);
        var create_by = req.body.create_by;
        var bodyFriends        = req.body.friends;
        var idFriends = [];
        if ( bodyFriends == null || create_by == null ) {
          return res.status (400).json ({'error': 'missing parameters!'});
        }
        forEach(bodyFriends,function(friend){
          idFriends.push({id:friend })
        })
        
        var friends = [];
        var fflok =  new ffloks();
        if (user){
            fflok.friends = idFriends;
            fflok.create_by = create_by;
            ffloks.createFFlok( fflok ,function(err,fflok){
             if(err){
               throw err;
             }
             var vote = true;
             var acepte = true;
             create_by_me = true;
             users.addfflokToUser(create_by,fflok._id,vote,acepte,create_by_me,function(err,number){
              if(err){
                throw err;
              }
             });
             return res.status(200).json({'id fflok':fflok.id});
           });
           }else{
             return res.status(500).json({'error': 'wrong token'});
         }
   },
   updatePlacefflok : function(req,res){
      // Getting auth header
      var headerAuth  = req.headers['authorization'];
      var user        = jwtUtils.getUser(headerAuth);
      var titre = req.body.title;
      var idfflok = req.body.idfflok;
      var datefflok= req.body.datefflok;
      var statu    = req.body.statufflok;
      var places = req.body.places;
      var idPlace = [];
       if (idfflok == null ||   titre == null ||   places == null) {   
        
        return res.status (400).json ({'error': 'missing parameters!'});
      }
      forEach(places,function(place){
        idPlace.push({id:place })
      })
      if (user){
        ffloks.updatePlacesFFlok( idfflok , idPlace, titre ,function(err,fflok){
          if(err){
            throw err;
          }
         //Send code via sms to user fflok 
           fflok.friends.forEach(function(user) {
            let message = fflok.create_by.prenon +' ' +i18n.Sms_Invitation_fflok.fr + ' '+ fflok.titre + " id = "+fflok.id;
             
            var peylod ={
              data:{
                Mykey1 :message,
                Mykey2 :fflok.id
              }
            };
              fireBase.sendNotifaction(peylod,user.id.registrationToken);
            });

          return res.status(200).json({
            'success':true,
            'fflok':fflok
          });
        });
        }else{
          return res.status(500).json({'error': 'wrong token'});
      }

   },
   getProximitePlace: function(req,res){
     // Getting auth header
     var headerAuth  = req.headers['authorization'];
     var user        = jwtUtils.getUser(headerAuth);
     var myPosition = req.body;
     var latitude = myPosition.latitude;
     var longtitude = myPosition.longitude;
     var googlePlace ;

     if (latitude == null ||   longtitude == null ) {
      return res.status (400).json ({'error': 'missing parameters!'});
    }

     var idsPlaces = [];
     if (user){
     places.GetProximitePlace( latitude,longtitude ,function(err,listeplaces){
          if(err){
            throw err;
          }
          forEach( listeplaces,function(p){
            idsPlaces.push(p.id_google);
          });
          if(listeplaces.length < 4) {
            getJSON(config.baseUrlGoogleMap + '/nearbysearch/json?location='+ latitude  +','+ longtitude +'&radius=5000&type=restaurant&key='+config.keyGoogleMap, function(error, response){
              if(response == undefined){
                return res.status(500).json({'error:':'bug api google'});
              }
             googlePlace = response.results;
                getGooglePlace(googlePlace,idsPlaces,listeplaces,4,function(callback){
                  return res.status(200).json({
                    'success':true,
                    'length places':callback.length,
                    'places ':callback
                  });
                });
              });
             }
          else{
            return res.status(200).json({
              'success':true,
              'legth places':listeplaces.length,
              'places ':listeplaces
              
            });
          }
        });
     }else{
         return res.status(500).json({'error': 'wrong token'});
     }
  },
  getProximitePlaceExplorer: function(req,res){
    // Getting auth header
    var headerAuth  = req.headers['authorization'];
    var user        = jwtUtils.getUser(headerAuth);
    var myPosition = req.body;
    var latitude = myPosition.latitude;
    var longtitude = myPosition.longtitude;
    var googlePlace ;

    if (latitude == null ||   longtitude == null ) {
     return res.status (400).json ({'error': 'missing parameters!'});
   }

    var idsPlaces = [];
    if (user){
     places.GetProximitePlaceExplorer( latitude,longtitude ,function(err,listeplaces){
         if(err){
           throw err;
         }
         console.log(listeplaces);
         forEach( listeplaces,function(p){
           idsPlaces.push(p.id_google);
         });
         if( listeplaces.length <20 ){
          getJSON(config.baseUrlGoogleMap + '/nearbysearch/json?location='+ latitude  +','+ longtitude +'&radius=5000&type=restaurant&key='+config.keyGoogleMap, function(error, response){
            if(response == undefined){
              return res.status(500).json({'error:':'bug api google'});
            }
           googlePlace = response.results;
              getGooglePlace(googlePlace,idsPlaces,listeplaces,20,function(callback){
                return res.status(200).json({
                  'success':true,
                  'length places':callback.length,
                  'places ':callback
                  
                });
              });
              
           });
         }else{
          return res.status(200).json({
            'success':true,
            'length places':listeplaces.length,
            'places ':listeplaces
            
          });
         }
        });
    }else{
        return res.status(500).json({'error': 'wrong token'});
    }
 },
  aceptFFlok: function(req,res){
    // Getting auth header
    var headerAuth  = req.headers['authorization'];
    var user        = jwtUtils.getUser(headerAuth);
    var data = req.body;
    var idfflok = data.idfflok;
    var idUser = data.idUser;
    
    if (idUser == null ||   idfflok == null ) {
        return res.status (400).json ({'error': 'missing parameters!'});
    }
    if (user){
      ffloks.aceptFFlok( idfflok,idUser ,function(err,fflok){
         if(err){
           throw err;
         }
         users.addfflokToUser(idUser,idfflok,false,true,false,function(err,number){
          if(err){
            throw err;
          }
         });
         return res.status(200).json({
          'success':true
         });
       });
    }else{
        return res.status(500).json({'error': 'wrong token'});
    }
  },
  leaveFFlok: function(req,res){
    // Getting auth header
    var headerAuth  = req.headers['authorization'];
    var user        = jwtUtils.getUser(headerAuth);
    var data = req.body;
    var idfflok = data.idfflok;
    var idUser = data.idUser;
    
    if (idUser == null ||   idfflok == null ) {
        return res.status (400).json ({'error': 'missing parameters!'});
    }
    if (user){
      ffloks.leaveFFlok( idfflok,idUser ,function(err,fflok){
         if(err){
           throw err;
         }
         return res.status(200).json({
          'success':true
         });
       });
    }else{
        return res.status(500).json({'error': 'wrong token'});
    }
  },
 /* getfflok: function(req,res){
    // Getting auth header
    var headerAuth  = req.headers['authorization'];
    var user        = jwtUtils.getUser(headerAuth);
    var data = req.params;
    var idfflok = data.id;
    if ( idfflok == null ) {
      return res.status (400).json ({'error': 'missing parameters!'});
    }
    if (user){
      ffloks.getFFlok( idfflok,function(err,fflok){
        console.log(fflok);
         if(err){
          return res.status(500).json(err);
         }
         let myfflok = {};
         myfflok.status = fflok.statu; 
         myfflok.id     = fflok._id;
         myfflok.date   = fflok.date;
         myfflok.user_invited = [];
         myfflok.places       = [];
         myfflok.messages       = fflok.messages;
         forEach(fflok.places,function(p){
          let placeUsers       = {};
          if(p){
            if( p.id.vote ){
              placeUsers.vote =  p.id.vote;
            }
            placeUsers.adresse= p.id.adresse;
            placeUsers.id = p.id.id;
            placeUsers.friends = [];
            myfflok.places.push (placeUsers) ;
          }
        });
         forEach(fflok.friends,function(f){
         let isFriend = false ;
         const start = async function(a, b) {
          const result = await friendOrNo(user,f.id._id);
          }

          
            forEach( myfflok.places,function(p){
              if(p.id && f.place){
                if(p.id.toString() === f.place.toString()){
                  p.friends.push(f.id);
                }
              }
            });
            let u = {};
            u.data = f.id;
            u.isFriend = isFriend;
            u.vote     = f.vote;
            if(f.place == undefined){
              f.place = null;
            }
            u.place    = f.place;
            myfflok.user_invited.push(u);
          });
         return res.status(200).json({
          'success':true,
          'fflok' : myfflok
         });
       });
    }else{
        return res.status(500).json({'error': 'wrong token'});
    }
  },
 */
  votefflok: function(req,res){
     // Getting auth header
      var headerAuth  = req.headers['authorization'];
      var user        = jwtUtils.getUser(headerAuth);
      var data = req.body;

      var idfflok = data.idfflok;
      var idUser = data.idUser;
      var idPlace = data.idPlace;
      if ( idfflok == null || idUser == null || idPlace == null) {
        return res.status (400).json ({'error': 'missing parameters!'});
      }
      if (user){
        ffloks.voteFFlok( idfflok,idUser,idPlace,function(err,fflok){
           if(err){
             return res.status(500).json(err);
           }
           return res.status(200).json({
            'success':true
           });
         });
      }else{
          return res.status(500).json({'error': 'wrong token'});
      }
  },
  addPicturesfflok:function(req, res) {
     // Getting auth header
  var headerAuth  = req.headers['authorization'];
  var userId      = jwtUtils.getUser(headerAuth);
  var idfflok  = "5b2775be5fb87d40fc9cb603"; //req.body.idUser
  var idUser   = "5b20d28ae532a41df020193e"; //req.body.idffolk

  if (userId){
      if( req.files == undefined ){
        return res.status(500).json({ 'error': 'file type invalid ' });
      }
      if(idfflok== undefined || idUser == undefined){
        return res.status(500).json({ 'error': 'missing parameters!' });
      }
    }
   forEach(req.files, function (file){
      path_image = file.fieldname + '-' + dateFormat(new Date(), "yyyy-mm-dd") + '-' + file.originalname;
      ffloks.addPicturesfflok( idfflok,idUser,path_image,function(err,fflok){
        if(err){
          return res.status(500).json(err);
        }
      });
   });
   return res.status(200).json({
    'success':true
   });
  },
  getAllMyfflok : function(req, res, next) {
    // Getting auth header
    var headerAuth  = req.headers['authorization'];
    var user        = jwtUtils.getUser(headerAuth);
    if (user){
      
    }
  },
}
/*async function friendOrNo (number, id, callback){
   
  await users.friendOrNo( number,id,function(err,friend){
     callback (true);
    if(friend.length >0) {
      callback (true);
      }
      else{
         callback(false) ;
      }
    });
}
*/
function getGooglePlace(googlePlace,idsPlaces,listeplaces,limite, callback) {
  let compt = 0;
  
  async.each(googlePlace,  function(place, next) {
    if(idsPlaces.indexOf(place.place_id) === -1 && compt <= limite - listeplaces.length ){
      compt++;
      var p = {};
      p.id_google  = place.place_id;
      p._id        = new ObjectId();
      p.type       = "resrtaurant";
      p.name       = place.name;
      p.vote       = place.rating;
      p.adresse    = place.vicinity;
      p.latitude   = place.geometry.location.lat;
      p.longtitude = place.geometry.location.lng;
      p.geo        = [place.geometry.location.lat,place.geometry.location.lng]
      if(place.photos){
        p.path_img = config.baseUrlGoogleMap + "/photo?maxwidth=400&photoreference="+ place.photos[0].photo_reference +"&key="+config.keyGoogleMap;
       }
       const url =  config.baseUrlGoogleMap + '/details/json?reference='+ place.reference+'&key='+config.keyGoogleMap;
       const getLocation = async url => {
         try {
           const response = await fetch(url);
           const json = await response.json();
           p.phone = json.result.formatted_phone_number;
          } catch (error) {
           console.log(error);
         }
       };
      await getLocation(url);
       places.addPlace( p ,function(err,place){
          listeplaces.push(place);
       });
    }
  }, function(err) {
    // if any of the file processing produced an error, err would equal that error
    if( err ) {
      // One of the iterations produced an error.
      // All processing will now stop.
      console.log(err);
    } else {
     console.log(listeplaces.length)
      callback(listeplaces);
    }});
  
   
}
