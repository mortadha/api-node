var express    = require('express');
var bodyParser = require('body-parser');
var place      = require('../models/place.js');
var jwtUtils   = require('../services/jwtRestaurateur.utils');
var config     = require('../config/config.js');
var dateFormat = require('dateformat');
var fs         = require('fs');

module.exports = {
    login: function(req,res){
        let login = req.body.login;
        let password = req.body.password;
        place.loginPlace(login,password,function(err,place){
             if(err){
               throw err;
             }
             if(place){
                return res.status(200).json({
                    'success':true,
                    'place': place,
                    'token': jwtUtils.generateTokenForUser(place)
                   });
             }else{
                return res.status(200).json({
                    'success':false,
                     "error" : "authentication failed"
                     });
             }
           });
     },
     updateStatus:function(req,res){
        // Getting auth header
        var headerAuth  = req.headers['authorization'];
        var login      = jwtUtils.getUser(headerAuth);
        let statut = req.body.statut; 
        if (statut == null ) {
            return res.status (400).json ({'error': 'missing statut'});
          }
        if (login){
            place.updateStatus(login,statut,function(err,place){
                if(err){
                    throw err;
                  }
                 if(place){
                   return res.status(200).json({
                    'success':true,
                    'result':{
                      'place':place
                      }
                    }
                   );
                  }
                  else{
                    return res.status(401).json({ 'error': 'incorrect login' });
                  }
            })
        }
        else{
            return res.status(401).json({ 'error': 'wrong token' });
          }
     },
     addTagPlace:function(req,res){
        // Getting auth header
        var headerAuth  = req.headers['authorization'];
        var login      = jwtUtils.getUser(headerAuth);
        let tag = req.body.tag; 
        if (tag == null ) {
            return res.status (400).json ({'error': 'missing tag'});
          }
        if (login){
            place.addTagPlace(login,tag,function(err,place){
                if(err){
                    throw err;
                  }
                 if(place){
                   return res.status(200).json({
                    'success':true,
                    'result':{
                      'place':place
                      }
                    }
                   );
                  }
                  else{
                    return res.status(401).json({ 'error': 'incorrect login' });
                  }
            })
        }
        else{
            return res.status(401).json({ 'error': 'wrong token' });
          }
     },
     deleteTagPlace:function(req,res){
        // Getting auth header
        var headerAuth  = req.headers['authorization'];
        var login      = jwtUtils.getUser(headerAuth);
        let tag = req.body.tag; 
        if (tag == null ) {
            return res.status (400).json ({'error': 'missing tag'});
          }
        if (login){
            place.deleteTagPlace(login,tag,function(err,place){
                if(err){
                    throw err;
                  }
                 if(place){
                   return res.status(200).json({
                    'success':true,
                    'result':{
                      'place':place
                      }
                    }
                   );
                  }
                  else{
                    return res.status(401).json({ 'error': 'incorrect login' });
                  }
            })
        }
        else{
            return res.status(401).json({ 'error': 'wrong token' });
          }
    },
    addMessagePlace:function(req,res){
        // Getting auth header
        var headerAuth  = req.headers['authorization'];
        var login       = jwtUtils.getUser(headerAuth);
        let message     = req.body.message; 
        var visible     = true;
        if (message == null ) {
            return res.status (400).json ({'error': 'Missing message'});
        }          
        if (login) {
            // check if message exist or not
            place.getMessageByText(login,message,function(err,result){
                if(err){
                    throw err;
                }
                if(result){
                    var r =  result.messages.filter(function(hero) {
                        return hero.text == message;
                    });
                    // make the message visible
                    if(r[0].visible == true){
                        return res.status(200).json({
                            'success':false,
                            'message': 'This message already exists'
                        });
                    } else {
                        place.updateStatusMessage(login,message,visible,function(err,place){
                            if(err){
                                throw err;
                            }
                            if(place){
                                return res.status(200).json({
                                    'success':true,
                                    'message': 'The message has been successfully added'
                                });                            
                            } else {
                                return res.status(401).json({'error': 'incorrect login'});
                            }
                        });
                    }                    
                } else {                    
                    place.addMessagePlace(login,message,function(err,place){
                        if(err){
                            throw err;
                        }
                        if(place){
                            return res.status(200).json({
                                'success':true,
                                'message': 'The message has been successfully added'
                            });
                        } else {
                            return res.status(401).json({ 'error': 'incorrect login' });
                        }
                    });
                }
            });
        }
        else{
            return res.status(401).json({ 'error': 'wrong token' });
        }
    },
    DeleteMessage:function(req,res){
        // Getting auth header
        var headerAuth = req.headers['authorization'];
        var login      = jwtUtils.getUser(headerAuth);
        let text       = req.body.message;
        var visible    = false;
        if (login) {
            if (text == null) {
                return res.status (400).json ({'error': 'Missing parameters!'});             
            }
            // check if message exist or not
            place.getMessageByText(login,text,function(err,result){
                if(err){
                    throw err;
                }
                if(result){
                    // Update message status to visible or not
                    place.updateStatusMessage(login,text,visible,function(err,place){
                        if(err){
                            throw err;
                        }
                        if(place){
                            return res.status (200).json ({'success':true,'message':'Deleted message with success'})
                        } else {
                            return res.status(401).json({'error': 'incorrect login'});
                        }
                    });
                } else {
                    return res.status(400).json({'error': 'Message not found'});
                }
            });            
        } else {
            return res.status(401).json({'error': 'Wrong token'});
        }    
    },
    addPictures:function(req, res) {
        // Getting auth header
        var headerAuth = req.headers['authorization'];
        var login      = jwtUtils.getUser(headerAuth);
        if (login) {
            if(req.body.position == undefined || req.files.length == 0){
                return res.status(500).json({ 'error': 'Missing parameters!' });
            }  else {
                req.files.forEach(function(file) {
                    place.addPictures(login,req.body.position,file.filename,function(err,place){
                        if(err){
                            return res.status(500).json(err);
                        }
                    });             
                });
                return res.status(200).json({
                    'success':true,
                    'message': 'Images successfully added'
                });
            }
        } else {
            return res.status(401).json({'error': 'Wrong token'});
        }
    },
    deletePicture:function(req, res) {
        // Getting auth header
        var headerAuth = req.headers['authorization'];
        var login      = jwtUtils.getUser(headerAuth);
        var fileName   = req.body.filename;
        if (login) {
            if(fileName == undefined){
                return res.status(500).json({ 'error': 'Missing parameters!' });
            }  else {     
                fs.exists("./public/places/"+fileName, function(exists) {
                    if(exists) {
                        place.deletePicture(login,fileName,function(err,place){                
                            console.log(place);
                            if(err){
                                return res.status(500).json(err);
                            }
                            if(place){                                
                                fs.unlink('./public/places/'+fileName);
                                return res.status (200).json ({'success':true,'message':'Deleted Image with success'})
                            } else {
                                return res.status(401).json({'error': 'incorrect login'});
                            }
                        });
                    } else {
                        return res.status(401).json({'success':false,'error': 'File not found, so not deleting.'});
                    }
                });
            }
        } else {
            return res.status(401).json({'error': 'Wrong token'});
        }
    },    
}