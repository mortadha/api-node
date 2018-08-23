var express = require('express');
var bodyParser = require('body-parser');
places = require('../../models/place.js');
var jwtUtils= require('../../services/jwtAdmin.utils');
var config = require('../../config/config.js');
var cron = require('node-cron');
var dateFormat = require('dateformat');
var i18n = require('../../services/locale.json');
var octopush = require('octopush');
var config = require('../../config/config.js');

module.exports = {
    addPlace: function(req, res){
        
         // Getting auth header
        var headerAuth  = req.headers['authorization'];
        var adminId      = jwtUtils.getAdmin(headerAuth);
        var place = req.body;
        var name = place.name;
        var vote = place.vote;
        var adresse = place.adresse;
        var latitude = place.latitude;
        var longtitude = place.longtitude;
        var phone = place.phone;
        var login = place.login;
        var password = place.password;
        place.geo=[latitude,longtitude];
        if (name == null  || adresse==null || latitude==null || longtitude==null || phone==null) {
            return res.status (400).json ({'error': 'missing parameters!'});
        }
        if(place.premium){
          if (login == null  || password==null ) {
            return res.status (400).json ({'error': 'missing parameters!'});
           }
        }
        if (adminId){
            if(req.file == undefined){
                return res.status (400).json ({'error': 'file must be a image'});
            }
            var path_image = req.file.fieldname + '-' + dateFormat(new Date(), "yyyy-mm-dd") + '-' + req.file.originalname;
            places.getPlaceIdGoogle(place.id_google, function(err,placeExists){
              if(err){ 
                throw err;
              }
              if(placeExists == null){
                places.addPlace( place ,function(err,place){
                  if(err){ 
                    throw err;
                  }
                  if(place.premium){
                    //Send code via sms to Gloo 
                    var sms = new octopush.SMS(config.user_login, config.api_key);
                    sms.set_sms_text(i18n.Sms_validationGloo.fr + login + " / "+ password);
                    sms.set_sms_recipients([place.phone]);
                    sms.set_sms_type(config.sms_type);
                    sms.set_sms_sender(config.sms_sender);
                    sms.set_sms_request_id(sms.uniqid());
                    sms.send(function(e, r){
                      console.log(e);
                      console.log(r);
                    });
                  }
                  
                  return res.status(200).json(place);
                });
              }else{
                return res.status(401).json("already exists");
              }
            });
            
            }else{
              return res.status(500).json({'error': 'wrong token'});
          }
    }
    ,getPlaces: function(req, res, next){
       // Getting auth header
        var headerAuth  = req.headers['authorization'];
        var adminId      = jwtUtils.getAdmin(headerAuth);
        if (adminId){
            places.getPlaces( function(err, places){
                if(err){
                  err = err.errors
                  res.status(500).json({
                    err
                  });
                  }
                res.status(200).json({
                  'success':true,
                  'result':{
                    'places' :places}
                  });
              });
        }else{
            return res.status (400).json ({'error': 'wrong token'});
          }
    }
    ,coutPlace : function (req,res ,next){
      // Getting auth header
      var headerAuth  = req.headers['authorization'];
      var adminId      = jwtUtils.getAdmin(headerAuth);
      if (adminId){ 
        places.coutPlace( function(err, places){
          if(err){
            err = err.errors
            res.status(500).json({
              err
            });
            }
          res.status(200).json({
            'success':true,
            'result':{
              'places' :places}
            });
        });

      }else{
        return res.status (400).json ({'error': 'wrong token'});
      }
    }
    ,deletePlace : function (req,res ,next){
      // Getting auth header
      var headerAuth  = req.headers['authorization'];
      var adminId      = jwtUtils.getAdmin(headerAuth);
      var id = req.params.id;
      if (adminId){ 
        places.deletePlace(id, function(err, place){
          if(err){
            err = err.errors
            res.status(500).json({
              err
            });
            }
          res.status(200).json({
            'success':true,
            'result':{
              'place' :place}
            });
        });

      }else{
        return res.status (400).json ({'error': 'wrong token'});
      }
    },getPlace : function (req,res ,next){
      // Getting auth header
      var headerAuth  = req.headers['authorization'];
      var adminId      = jwtUtils.getAdmin(headerAuth);
      var id = req.params.id;
      if (adminId){ 
        places.getPlace(id, function(err, place){
          if(err){
            err = err.errors
            res.status(500).json({
              err
            });
            }
          res.status(200).json({
            'success':true,
            'result':{
              'place' :place}
            });
        });

      }else{
        return res.status (400).json ({'error': 'wrong token'});
      }
    }
}

cron.schedule('* * * * *', function(){
  places.getPlaces( function(err, places){
    if(err){
      err = err.errors
      res.status(500).json({
        err
      });
      }
      
  });
});