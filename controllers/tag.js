var express = require('express');
var bodyParser = require('body-parser');
tag = require('../models/tag.js');
var jwtUtils= require('../services/jwt.utils');
var config = require('../config/config.js');

module.exports = {
    fingTagsfflok: function(req,res){
        // Getting auth header
        var headerAuth  = req.headers['authorization'];
        var user        = jwtUtils.getUser(headerAuth);
        var text        = req.body.text;
        if (user){
            tag.findTags( text ,'fflok',function(err,tags){
             if(err){
               throw err;
             }
             return res.status(200).json({
              'success':true,
              'titles ': tags
             });
           });
           }else{
             return res.status(500).json({'error': 'wrong token'});
         }
   },
   getTagsfflok: function(req,res){
       // Getting auth header
        var headerAuth  = req.headers['authorization'];
        var user        = jwtUtils.getUser(headerAuth);
        if (user){
            tag.getTags('fflok' , function(err,tags){
             if(err){
               throw err;
             }
             return res.status(200).json({
              'success':true,
              'titles ': tags
             });
           });
           }else{
             return res.status(500).json({'error': 'wrong token'});
         }
   }
}