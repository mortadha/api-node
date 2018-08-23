var express = require('express');
var bodyParser = require('body-parser');
ffloks = require('./models/fflok.js');
places = require('./models/place.js');
users = require('./models/user.js');
var jwtUtils= require('./services/jwt.utils');
var config = require('./config/config.js');
var octopush = require('octopush');
var i18n = require('./services/locale.json');
var forEach = require('async-foreach').forEach;
var async = require("async");
var getJSON = require('get-json')
var distance = require('google-distance');

module.exports = function(io) {
  var apiRouter = express.Router();

  apiRouter.put('/io/voteFFlok', function(req, res) {
    var headerAuth  = req.headers['authorization'];
    var user        = jwtUtils.getUser(headerAuth);
    var data        = req.body;
    var idfflok     = data.idfflok;
    var idUser      = data.idUser;
    var idPlace     = data.idPlace;
    if ( idfflok == null || idUser == null || idPlace == null) {
      return res.status (400).json ({'error': 'missing parameters!'});
    }
    if (user){
      ffloks.voteFFlok( idfflok,idUser,idPlace,function(err,fflok){
        if(err){
        return res.status(500).json(err);
        }
        let myfflok          = {};
        myfflok.status       = fflok.statu; 
        myfflok.id           = fflok._id;
        myfflok.date         = fflok.date;
        myfflok.user_invited = [];
        myfflok.places       = [];
        forEach(fflok.places,function(p){
          let placeUsers = {};
          if(p){
            if( p.id.vote ){
              placeUsers.vote =  p.id.vote;
            }
            placeUsers.adresse= p.id.adresse;
            placeUsers.id = p.id.id;
            placeUsers.friends = [];
            myfflok.places.push (placeUsers);
          }
        });
        forEach(fflok.friends,function(f){
          let isFriend = false ;
          const start =  function(a, b) {
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
          myfflok.user_invited.push(u);
        });
        io.sockets.emit('voteuser 5',{a: [myfflok]});
        return res.status(200).json({'success':true,'fflok' : myfflok});
      });
    }else{
      return res.status(500).json({'error': 'wrong token'});
    }
  });

    apiRouter.put('/io/decisionFFlok', function(req, res) {
      var headerAuth  = req.headers['authorization'];
      var user        = jwtUtils.getUser(headerAuth);
      var data = req.body;
      var idfflok = data.idfflok;
      var idPlace = data.idPlace;
      var democrate = data.democrate; 
      var myAcouant = {};
      if (user){
        users.getMyProfil(user, function(err,me){
          if(err){
            return res.status(500).json(err);
           }
           var numDemocrate = me.démocrate;
           var number_fflok = me.fflok.length;
          if(democrate == "false"){
              numDemocrate = numDemocrate -((1/number_fflok)*100);
             users.updateDémocrateUser(user,numDemocrate,function(err,user){
              if(err){
                return res.status(500).json(err);
               }
               
             });
          }
          ffloks.decisionFFlok(idfflok,idPlace,function(err,result){
            if(result){
              places.placeWin(idPlace,function(errP,resultP){
                if(resultP){
                  io.sockets.emit('voteuser 5',{result: [result.final_Place]});
                  return res.status(200).json({
                    'success':true,
                    'democrate' : democrate,
                    'result' : result.final_Place
                  });
                } else {
                  return res.status(500).json(err);
                }                    
              });
            } else {
              return res.status(500).json(err);
            }                        
          });
        });
      }else{
              return res.status(500).json({'error': 'wrong token'});
          }
    });
  /*  apiRouter.put('/io/updatepositionForfflok',  function(req, res) {
    // Getting auth header
        var headerAuth  = req.headers['authorization'];
        var userId      = jwtUtils.getUser(headerAuth);
        
        if (userId){
          var latitude  = req.body.latitude;
          var longitude = req.body.longitude;
          var idfflok   = req.body.idfflok;
          var listUsers = [];
          var listUsers2;
          if ( latitude==null || longitude==null || idfflok==null) {
            return res.status (400).json ({'error': 'missing parameters!'});
          }
         users.updatePosition(userId,latitude,longitude, function(err, user){
        if(err){
          throw err;
        }
        ffloks.getPositionFFlokUser(idfflok,  function(err,result){
          if(err){
            throw err;
          }
          var latitiudePlace = result.final_Place.latitude;
          var longtitudePlace = result.final_Place.longtitude;
          var nombreUser = result.friends.length;
          const waitFor = (ms) => new Promise(r => setTimeout(r, ms))
          const start = async () => {
            await asyncForEach(result.friends, async (friend) => {
              await waitFor(50)
              if(friend.vote){

              var user = {};
              user.phone    = friend.id.phone;
              user.path_img = friend.id.path_img;
              distance.get(
              {
                index: 1,
                origin: latitiudePlace + ',' + longtitudePlace,
                destination: friend.id.latitude + ',' + friend.id.longitude
              },
              async function(err, data) {
                if (err) return console.log(err);
                user.duration = data.duration;
                user.distance = data.distance;
                listUsers.push(user);
                if( listUsers.length == nombreUser ){

                  var organizer = {};
                  organizer.name = result.create_by.prenon;
                  organizer.path_img = result.create_by.path_img;
                  organizer.phone = result.create_by.phone;
                  organizer.latitude = result.create_by.latitude;
                  organizer.longitude = result.create_by.longitude;

                  var place =  {};
                  place.name = result.final_Place.name;
                  place.path_img = result.final_Place.path_img;
                  place.latitude = result.final_Place.latitude;
                  place.longtitude = result.final_Place.longtitude;
                  place.vote = result.final_Place.vote;
                  place.adresse = result.final_Place.adresse;

                  var fflok = {};
                  fflok.statu = result.statu;
                  fflok.titre = result.titre;
                  fflok.titre = result.date;

                  io.sockets.emit('distance'+idfflok,{result: [{"liste users":listUsers},{"organizer : ":organizer},{"place":place},{"fflok":fflok}]});
                }
              });
            }
            });
           }
          start();
        });
         res.json({
              'success':true});
          });
        }
        else{
          return res.status(401).json({ 'error': 'wrong token' });
        }
     });
     apiRouter.put('/io/sendMessagfflok',  function(req, res) {
      // Getting auth header
      var headerAuth  = req.headers['authorization'];
      var userId      = jwtUtils.getUser(headerAuth);
      if (userId){
        var idfflok   = req.body.idfflok;
        var message   = req.body.message;
        io.sockets.emit('tchat'+idfflok,{result: [{"message":message}]});
        ffloks.addMessagefflok(idfflok,userId,message,  function(err,result){
          if(err){
            throw err;
          }
          return res.status(200).json({ 'success':true });
        });
      }
        else{
          return res.status(401).json({ 'error': 'wrong token' });
        }
    });
    return apiRouter;
    };
    async function asyncForEach(array, callback) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
      }
    }*/
