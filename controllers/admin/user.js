var express = require('express');
var bodyParser = require('body-parser');
users = require('../../models/user');
var jwtUtils= require('../../services/jwtAdmin.utils');
var config = require('../../config/config.js');


module.exports = {
    coutUser : function (req,res ,next){
      // Getting auth header
      var headerAuth  = req.headers['authorization'];
      var adminId      = jwtUtils.getAdmin(headerAuth);
      if (adminId){ 
        users.coutUser( function(err, users){
          if(err){
            err = err.errors
            res.status(500).json({
              err
            });
            }
          res.status(200).json({
            'success':true,
            'result':{
              'users' :users}
            });
        });

      }else{
        return res.status (400).json ({'error': 'wrong token'});
      }
    },
    getAllUsers : function (req,res ,next){
      // Getting auth header
      var headerAuth  = req.headers['authorization'];
      var adminId      = jwtUtils.getAdmin(headerAuth);
      if (adminId){ 
        users.getUsers( function(err,users){
          if(err){
            err = err.errors
            res.status(500).json({
              err
            });
            }
          res.status(200).json({
            'success':true,
            'result':{
              'users' :users}
            });
        });

      }else{
        return res.status (400).json ({'error': 'wrong token'});
      }
    }
}

