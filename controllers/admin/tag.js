var express = require('express');
var bodyParser = require('body-parser');
Tags = require('../../models/tag.js');
var jwtUtils= require('../../services/jwtAdmin.utils');
var config = require('../../config/config.js');

module.exports = {
    addTag: function(req, res){

        // Getting auth header
       var headerAuth  = req.headers['authorization'];
       var adminId      = jwtUtils.getAdmin(headerAuth);
       var tag = req.body;
       var text = tag.text;
       var type = tag.type;

       if (text == null  || type==null ) {
           return res.status (400).json ({'error': 'missing parameters!'});
       }
       if (adminId){
           Tags.addTag(tag ,function(err,tag){
             if(err){
               throw err;
             }
             return res.status(200).json(tag);
           });
           }else{
             return res.status(500).json({'error': 'wrong token'});
         }
   },
   getTags: function(req,res){
        // Getting auth header
        var headerAuth  = req.headers['authorization'];
        var adminId      = jwtUtils.getAdmin(headerAuth);
        if (adminId){
            Tags.getTags( 'fflok',function(err,tags){
             if(err){
               throw err;
             }
             return res.status(200).json(tags);
           });
           }else{
             return res.status(500).json({'error': 'wrong token'});
         }
   }
}